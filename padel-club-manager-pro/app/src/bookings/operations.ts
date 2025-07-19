import { type Booking } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { z } from 'zod';

// Validation schemas
const CreateBookingSchema = z.object({
  date: z.string().refine((date) => {
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  }, 'Booking date must be today or in the future'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  duration: z.number().min(30, 'Minimum duration is 30 minutes').max(240, 'Maximum duration is 4 hours').default(90),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']).default('pending'),
  customerName: z.string().min(1, 'Customer name is required').max(100, 'Customer name too long'),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
  totalPrice: z.number().min(0, 'Total price must be positive'),
  isPaid: z.boolean().default(false),
  paymentMethod: z.enum(['cash', 'card', 'online', 'transfer']).optional(),
  courtId: z.string(),
  clubId: z.string(),
});

const UpdateBookingSchema = CreateBookingSchema.partial().extend({
  id: z.string(),
});

const GetBookingsSchema = z.object({
  clubId: z.string(),
  courtId: z.string().optional(),
  date: z.string().optional(), // YYYY-MM-DD format
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']).optional(),
  startDate: z.string().optional(), // For date range queries
  endDate: z.string().optional(),
});

type CreateBookingData = z.infer<typeof CreateBookingSchema>;
type UpdateBookingData = z.infer<typeof UpdateBookingSchema>;
type GetBookingsData = z.infer<typeof GetBookingsSchema>;

// Helper function to check club access
const checkClubAccess = async (clubId: string, user: any, entities: any) => {
  const club = await entities.Club.findUnique({
    where: { id: clubId },
    include: { users: true }
  });

  if (!club) {
    throw new HttpError(404, 'Club not found');
  }

  const userHasAccess = club.users.some((u: any) => u.id === user.id) || user.isAdmin;
  if (!userHasAccess) {
    throw new HttpError(403, 'You do not have access to this club');
  }

  return club;
};

// Helper function to check for booking conflicts
const checkBookingConflicts = async (
  courtId: string, 
  date: string, 
  startTime: string, 
  endTime: string, 
  excludeBookingId: string | null, 
  entities: any
) => {
  const conflictingBookings = await entities.Booking.findMany({
    where: {
      courtId,
      date: new Date(date),
      status: { in: ['pending', 'confirmed'] },
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
      OR: [
        // New booking starts during existing booking
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } }
          ]
        },
        // New booking ends during existing booking
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } }
          ]
        },
        // New booking completely contains existing booking
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } }
          ]
        }
      ]
    }
  });

  return conflictingBookings.length > 0;
};

// Create a new booking
export const createBooking = async (args: CreateBookingData, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create a booking');
  }

  // Validate input
  const validatedData = CreateBookingSchema.parse(args);

  try {
    // Check club access
    await checkClubAccess(validatedData.clubId, context.user, context.entities);

    // Verify court belongs to the club
    const court = await context.entities.Court.findUnique({
      where: { id: validatedData.courtId },
      include: { club: true }
    });

    if (!court || court.clubId !== validatedData.clubId) {
      throw new HttpError(404, 'Court not found or does not belong to this club');
    }

    if (court.status !== 'active' || !court.isAvailable) {
      throw new HttpError(400, 'Court is not available for booking');
    }

    // Check for booking conflicts
    const hasConflicts = await checkBookingConflicts(
      validatedData.courtId,
      validatedData.date,
      validatedData.startTime,
      validatedData.endTime,
      null,
      context.entities
    );

    if (hasConflicts) {
      throw new HttpError(409, 'Time slot conflicts with existing booking');
    }

    // Validate time logic
    const startTimeMinutes = parseInt(validatedData.startTime.split(':')[0]) * 60 + parseInt(validatedData.startTime.split(':')[1]);
    const endTimeMinutes = parseInt(validatedData.endTime.split(':')[0]) * 60 + parseInt(validatedData.endTime.split(':')[1]);
    const actualDuration = endTimeMinutes - startTimeMinutes;

    if (actualDuration !== validatedData.duration) {
      throw new HttpError(400, 'Duration does not match start and end times');
    }

    if (actualDuration <= 0) {
      throw new HttpError(400, 'End time must be after start time');
    }

    // Create the booking
    const booking = await context.entities.Booking.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        createdById: context.user.id
      },
      include: {
        court: {
          select: {
            id: true,
            name: true,
            type: true,
            pricePerHour: true
          }
        },
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            timezone: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });

    return booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error creating booking:', error);
    throw new HttpError(500, 'Failed to create booking');
  }
};

// Get bookings for a club
export const getBookings = async (args: GetBookingsData, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view bookings');
  }

  // Validate input
  const validatedData = GetBookingsSchema.parse(args);

  try {
    // Check club access
    await checkClubAccess(validatedData.clubId, context.user, context.entities);

    // Build where clause
    const whereClause: any = {
      clubId: validatedData.clubId
    };

    if (validatedData.courtId) {
      whereClause.courtId = validatedData.courtId;
    }

    if (validatedData.date) {
      whereClause.date = new Date(validatedData.date);
    } else if (validatedData.startDate && validatedData.endDate) {
      whereClause.date = {
        gte: new Date(validatedData.startDate),
        lte: new Date(validatedData.endDate)
      };
    }

    if (validatedData.status) {
      whereClause.status = validatedData.status;
    }

    // Get bookings
    const bookings = await context.entities.Booking.findMany({
      where: whereClause,
      include: {
        court: {
          select: {
            id: true,
            name: true,
            type: true,
            pricePerHour: true
          }
        },
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            timezone: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return bookings;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error fetching bookings:', error);
    throw new HttpError(500, 'Failed to fetch bookings');
  }
};

// Update booking
export const updateBooking = async (args: UpdateBookingData, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to update a booking');
  }

  // Validate input
  const validatedData = UpdateBookingSchema.parse(args);
  const { id, ...updateData } = validatedData;

  try {
    // Check if booking exists
    const existingBooking = await context.entities.Booking.findUnique({
      where: { id },
      include: {
        court: {
          include: {
            club: {
              include: {
                users: true
              }
            }
          }
        }
      }
    });

    if (!existingBooking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Check club access
    const userHasAccess = existingBooking.court.club.users.some((u: any) => u.id === context.user.id) || context.user.isAdmin;
    if (!userHasAccess) {
      throw new HttpError(403, 'You do not have permission to update this booking');
    }

    // If updating time/date, check for conflicts
    if (updateData.date || updateData.startTime || updateData.endTime) {
      const date = updateData.date || existingBooking.date.toISOString().split('T')[0];
      const startTime = updateData.startTime || existingBooking.startTime;
      const endTime = updateData.endTime || existingBooking.endTime;

      const hasConflicts = await checkBookingConflicts(
        existingBooking.courtId,
        date,
        startTime,
        endTime,
        id,
        context.entities
      );

      if (hasConflicts) {
        throw new HttpError(409, 'Time slot conflicts with existing booking');
      }

      // Validate time logic if times are being updated
      if (updateData.startTime || updateData.endTime) {
        const startTimeMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endTimeMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
        const actualDuration = endTimeMinutes - startTimeMinutes;

        if (actualDuration <= 0) {
          throw new HttpError(400, 'End time must be after start time');
        }

        // Update duration if not explicitly provided
        if (!updateData.duration) {
          updateData.duration = actualDuration;
        }
      }
    }

    // Convert date string to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date) as any;
    }

    // Update the booking
    const updatedBooking = await context.entities.Booking.update({
      where: { id },
      data: updateData,
      include: {
        court: {
          select: {
            id: true,
            name: true,
            type: true,
            pricePerHour: true
          }
        },
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            timezone: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });

    return updatedBooking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error updating booking:', error);
    throw new HttpError(500, 'Failed to update booking');
  }
};

// Cancel booking
export const cancelBooking = async (args: { id: string, reason?: string }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to cancel a booking');
  }

  try {
    // Check if booking exists
    const existingBooking = await context.entities.Booking.findUnique({
      where: { id: args.id },
      include: {
        court: {
          include: {
            club: {
              include: {
                users: true
              }
            }
          }
        }
      }
    });

    if (!existingBooking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Check club access
    const userHasAccess = existingBooking.court.club.users.some((u: any) => u.id === context.user.id) || context.user.isAdmin;
    if (!userHasAccess) {
      throw new HttpError(403, 'You do not have permission to cancel this booking');
    }

    // Check if booking can be cancelled
    if (existingBooking.status === 'cancelled') {
      throw new HttpError(400, 'Booking is already cancelled');
    }

    if (existingBooking.status === 'completed') {
      throw new HttpError(400, 'Cannot cancel completed booking');
    }

    // Update booking status
    const cancelledBooking = await context.entities.Booking.update({
      where: { id: args.id },
      data: {
        status: 'cancelled',
        notes: args.reason ? `${existingBooking.notes || ''}\n\nCancellation reason: ${args.reason}`.trim() : existingBooking.notes
      },
      include: {
        court: {
          select: {
            id: true,
            name: true,
            type: true,
            pricePerHour: true
          }
        },
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            timezone: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });

    return cancelledBooking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error cancelling booking:', error);
    throw new HttpError(500, 'Failed to cancel booking');
  }
};

// Get booking by ID (for detailed view)
export const getBooking = async (args: { id: string }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view booking details');
  }

  try {
    const booking = await context.entities.Booking.findUnique({
      where: { id: args.id },
      include: {
        court: {
          include: {
            club: {
              include: {
                users: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Check club access
    const userHasAccess = booking.court.club.users.some((u: any) => u.id === context.user.id) || context.user.isAdmin;
    if (!userHasAccess) {
      throw new HttpError(403, 'You do not have access to this booking');
    }

    return booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error fetching booking:', error);
    throw new HttpError(500, 'Failed to fetch booking');
  }
};

// Get availability for a court on a specific date
export const getCourtAvailability = async (args: { courtId: string, date: string }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to check availability');
  }

  try {
    // Get court and verify access
    const court = await context.entities.Court.findUnique({
      where: { id: args.courtId },
      include: {
        club: {
          include: {
            users: true
          }
        }
      }
    });

    if (!court) {
      throw new HttpError(404, 'Court not found');
    }

    // Check club access
    const userHasAccess = court.club.users.some((u: any) => u.id === context.user.id) || context.user.isAdmin;
    if (!userHasAccess) {
      throw new HttpError(403, 'You do not have access to this court');
    }

    // Get all bookings for this court on the specified date
    const bookings = await context.entities.Booking.findMany({
      where: {
        courtId: args.courtId,
        date: new Date(args.date),
        status: { in: ['pending', 'confirmed'] }
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        customerName: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return {
      court: {
        id: court.id,
        name: court.name,
        type: court.type,
        pricePerHour: court.pricePerHour,
        operatingHours: court.operatingHours
      },
      date: args.date,
      bookings,
      isAvailable: court.status === 'active' && court.isAvailable
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error checking court availability:', error);
    throw new HttpError(500, 'Failed to check court availability');
  }
};