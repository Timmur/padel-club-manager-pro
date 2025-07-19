import { type Club } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { z } from 'zod';

// Validation schemas
const CreateClubSchema = z.object({
  name: z.string().min(1, 'Club name is required').max(100, 'Club name too long'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default('Spain'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  timezone: z.string().default('Europe/Madrid'),
  currency: z.string().default('EUR'),
  settings: z.record(z.any()).optional(),
});

const UpdateClubSchema = CreateClubSchema.partial().extend({
  id: z.string(),
});

type CreateClubData = z.infer<typeof CreateClubSchema>;
type UpdateClubData = z.infer<typeof UpdateClubSchema>;

// Create a new club
export const createClub = async (args: CreateClubData, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to create a club');
  }

  // Validate input
  const validatedData = CreateClubSchema.parse(args);

  try {
    // Check if slug is already taken
    const existingClub = await context.entities.Club.findUnique({
      where: { slug: validatedData.slug }
    });

    if (existingClub) {
      throw new HttpError(400, 'Club slug already exists');
    }

    // Create the club
    const club = await context.entities.Club.create({
      data: {
        ...validatedData,
        // Associate the current user as the club admin
        users: {
          connect: { id: context.user.id }
        }
      },
      include: {
        users: true,
        courts: true,
        _count: {
          select: {
            courts: true,
            bookings: true
          }
        }
      }
    });

    // Update the user to belong to this club
    await context.entities.User.update({
      where: { id: context.user.id },
      data: { clubId: club.id }
    });

    return club;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error creating club:', error);
    throw new HttpError(500, 'Failed to create club');
  }
};

// Get club by ID
export const getClub = async (args: { id: string }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to view club details');
  }

  try {
    const club = await context.entities.Club.findUnique({
      where: { id: args.id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            username: true,
            isAdmin: true
          }
        },
        courts: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            isAvailable: true,
            pricePerHour: true
          }
        },
        _count: {
          select: {
            courts: true,
            bookings: true
          }
        }
      }
    });

    if (!club) {
      throw new HttpError(404, 'Club not found');
    }

    // Check if user has access to this club
    const userHasAccess = club.users.some((user: any) => user.id === context.user.id) || context.user.isAdmin;
    if (!userHasAccess) {
      throw new HttpError(403, 'You do not have access to this club');
    }

    return club;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error fetching club:', error);
    throw new HttpError(500, 'Failed to fetch club');
  }
};

// Update club
export const updateClub = async (args: UpdateClubData, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in to update a club');
  }

  // Validate input
  const validatedData = UpdateClubSchema.parse(args);
  const { id, ...updateData } = validatedData;

  try {
    // Check if club exists and user has access
    const existingClub = await context.entities.Club.findUnique({
      where: { id },
      include: {
        users: true
      }
    });

    if (!existingClub) {
      throw new HttpError(404, 'Club not found');
    }

    // Check permissions
    const userHasAccess = existingClub.users.some((user: any) => user.id === context.user.id) || context.user.isAdmin;
    if (!userHasAccess) {
      throw new HttpError(403, 'You do not have permission to update this club');
    }

    // Check if new slug is available (if slug is being updated)
    if (updateData.slug && updateData.slug !== existingClub.slug) {
      const clubWithSlug = await context.entities.Club.findUnique({
        where: { slug: updateData.slug }
      });
      if (clubWithSlug) {
        throw new HttpError(400, 'Club slug already exists');
      }
    }

    // Update the club
    const updatedClub = await context.entities.Club.update({
      where: { id },
      data: updateData,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            username: true,
            isAdmin: true
          }
        },
        courts: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            isAvailable: true,
            pricePerHour: true
          }
        },
        _count: {
          select: {
            courts: true,
            bookings: true
          }
        }
      }
    });

    return updatedClub;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error updating club:', error);
    throw new HttpError(500, 'Failed to update club');
  }
};

// Get club by slug (for public access)
export const getClubBySlug = async (slug: string, context: any) => {
  try {
    const club = await context.entities.Club.findUnique({
      where: { 
        slug,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        city: true,
        country: true,
        phone: true,
        email: true,
        website: true,
        timezone: true,
        settings: true,
        courts: {
          where: {
            status: 'active',
            isAvailable: true
          },
          select: {
            id: true,
            name: true,
            type: true,
            pricePerHour: true,
            operatingHours: true
          }
        }
      }
    });

    if (!club) {
      throw new HttpError(404, 'Club not found');
    }

    return club;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Error fetching club by slug:', error);
    throw new HttpError(500, 'Failed to fetch club');
  }
};

// Get user's club
export const getUserClub = async (context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  if (!context.user.clubId) {
    return null;
  }

  try {
    const club = await context.entities.Club.findUnique({
      where: { id: context.user.clubId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            username: true,
            isAdmin: true
          }
        },
        courts: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            isAvailable: true,
            pricePerHour: true
          }
        },
        _count: {
          select: {
            courts: true,
            bookings: true
          }
        }
      }
    });

    return club;
  } catch (error) {
    console.error('Error fetching user club:', error);
    throw new HttpError(500, 'Failed to fetch club');
  }
};