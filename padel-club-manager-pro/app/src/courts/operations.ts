import { type Court } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { z } from 'zod';

// Validation schemas
const OperatingHoursSchema = z.record(
  z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().optional()
  })
);

const CreateCourtSchema = z.object({
  name: z.string().min(1, 'Court name is required').max(50, 'Court name too long'),
  description: z.string().optional(),
  type: z.enum(['indoor', 'outdoor', 'covered']).default('outdoor'),
  surface: z.enum(['artificial_grass', 'concrete', 'ceramic']).default('artificial_grass'),
  status: z.enum(['active', 'maintenance', 'inactive']).default('active'),
  isAvailable: z.boolean().default(true),
  pricePerHour: z.number().min(0, 'Price must be positive').default(25.0),
  operatingHours: OperatingHoursSchema.optional(),
  clubId: z.string()
});

const UpdateCourtSchema = CreateCourtSchema.partial().extend({
  id: z.string(),
});

const GetCourtsSchema = z.object({
  clubId: z.string(),
  status: z.enum(['active', 'maintenance', 'inactive']).optional(),
  isAvailable: z.boolean().optional(),
});

type CreateCourtData = z.infer<typeof CreateCourtSchema>;
type UpdateCourtData = z.infer<typeof UpdateCourtSchema>;
type GetCourtsData = z.infer<typeof GetCourtsSchema>;

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

// Create a new court
export const createCourt = async (args: CreateCourtData, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create a court');
  }

  // Validate input
  const validatedData = CreateCourtSchema.parse(args);

  try {
    // Check club access
    await checkClubAccess(validatedData.clubId, context.user, context.entities);

    // Check if court name already exists in this club
    const existingCourt = await context.entities.Court.findFirst({
      where: {
        clubId: validatedData.clubId,
        name: validatedData.name
      }
    });

    if (existingCourt) {
      throw new HttpError(400, 'Court name already exists in this club');
    }

    // Create the court
    const court = await context.entities.Court.create({
      data: validatedData,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    return court;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error creating court:', error);
    throw new HttpError(500, 'Failed to create court');
  }
};

// Get courts for a club
export const getCourts = async (args: GetCourtsData, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view courts');
  }

  // Validate input
  const validatedData = GetCourtsSchema.parse(args);

  try {
    // Check club access
    await checkClubAccess(validatedData.clubId, context.user, context.entities);

    // Build where clause
    const whereClause: any = {
      clubId: validatedData.clubId
    };

    if (validatedData.status) {
      whereClause.status = validatedData.status;
    }

    if (validatedData.isAvailable !== undefined) {
      whereClause.isAvailable = validatedData.isAvailable;
    }

    // Get courts
    const courts = await context.entities.Court.findMany({
      where: whereClause,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return courts;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error fetching courts:', error);
    throw new HttpError(500, 'Failed to fetch courts');
  }
};

// Update court
export const updateCourt = async (args: UpdateCourtData, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to update a court');
  }

  // Validate input
  const validatedData = UpdateCourtSchema.parse(args);
  const { id, ...updateData } = validatedData;

  try {
    // Check if court exists
    const existingCourt = await context.entities.Court.findUnique({
      where: { id },
      include: {
        club: {
          include: {
            users: true
          }
        }
      }
    });

    if (!existingCourt) {
      throw new HttpError(404, 'Court not found');
    }

    // Check club access
    const userHasAccess = existingCourt.club.users.some((u: any) => u.id === context.user.id) || context.user.isAdmin;
    if (!userHasAccess) {
      throw new HttpError(403, 'You do not have permission to update this court');
    }

    // Check if new name conflicts (if name is being updated)
    if (updateData.name && updateData.name !== existingCourt.name) {
      const courtWithName = await context.entities.Court.findFirst({
        where: {
          clubId: existingCourt.clubId,
          name: updateData.name,
          id: { not: id }
        }
      });
      if (courtWithName) {
        throw new HttpError(400, 'Court name already exists in this club');
      }
    }

    // Update the court
    const updatedCourt = await context.entities.Court.update({
      where: { id },
      data: updateData,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    return updatedCourt;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error updating court:', error);
    throw new HttpError(500, 'Failed to update court');
  }
};

// Delete court
export const deleteCourt = async (args: { id: string }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to delete a court');
  }

  try {
    // Check if court exists
    const existingCourt = await context.entities.Court.findUnique({
      where: { id: args.id },
      include: {
        club: {
          include: {
            users: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    if (!existingCourt) {
      throw new HttpError(404, 'Court not found');
    }

    // Check club access
    const userHasAccess = existingCourt.club.users.some((u: any) => u.id === context.user.id) || context.user.isAdmin;
    if (!userHasAccess) {
      throw new HttpError(403, 'You do not have permission to delete this court');
    }

    // Check if court has bookings
    if (existingCourt._count.bookings > 0) {
      throw new HttpError(400, 'Cannot delete court with existing bookings. Cancel or complete all bookings first.');
    }

    // Delete the court
    await context.entities.Court.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error deleting court:', error);
    throw new HttpError(500, 'Failed to delete court');
  }
};

// Get court by ID (for detailed view)
export const getCourt = async (args: { id: string }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view court details');
  }

  try {
    const court = await context.entities.Court.findUnique({
      where: { id: args.id },
      include: {
        club: {
          include: {
            users: true
          }
        },
        bookings: {
          where: {
            date: {
              gte: new Date()
            }
          },
          take: 10,
          orderBy: {
            date: 'asc'
          },
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            status: true,
            customerName: true,
            totalPrice: true
          }
        },
        _count: {
          select: {
            bookings: true
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

    return court;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error fetching court:', error);
    throw new HttpError(500, 'Failed to fetch court');
  }
};