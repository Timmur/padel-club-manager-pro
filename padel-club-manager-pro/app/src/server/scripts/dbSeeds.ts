import { type User } from 'wasp/entities';
// import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';
import { getSubscriptionPaymentPlanIds, SubscriptionStatus } from '../../payment/plans';

// Simple fake data generator to replace faker temporarily
const simpleFaker = {
  internet: {
    email: ({ firstName, lastName }: { firstName: string, lastName: string }) => 
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    userName: ({ firstName, lastName }: { firstName: string, lastName: string }) => 
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}`
  },
  date: {
    between: ({ from, to }: { from: Date, to: Date }) => 
      new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()))
  },
  number: {
    int: ({ min, max }: { min: number, max: number }) => 
      Math.floor(Math.random() * (max - min + 1)) + min
  },
  string: {
    uuid: () => 
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
  },
  person: {
    firstName: () => ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Sofia'][Math.floor(Math.random() * 8)],
    lastName: () => ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez'][Math.floor(Math.random() * 8)]
  },
  helpers: {
    arrayElement: <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
    multiple: <T>(fn: () => T, { count }: { count: number }): T[] => 
      Array.from({ length: count }, () => fn())
  }
};

type MockUserData = Omit<User, 'id'>;

/**
 * This function, which we've imported in `app.db.seeds` in the `main.wasp` file,
 * seeds the database with mock users via the `wasp db seed` command.
 * For more info see: https://wasp.sh/docs/data-model/backends#seeding-the-database
 */
export async function seedMockUsers(prismaClient: PrismaClient) {
  await Promise.all(generateMockUsersData(50).map((data) => prismaClient.user.create({ data })));
}

function generateMockUsersData(numOfUsers: number): MockUserData[] {
  return simpleFaker.helpers.multiple(generateMockUserData, { count: numOfUsers });
}

function generateMockUserData(): MockUserData {
  const firstName = simpleFaker.person.firstName();
  const lastName = simpleFaker.person.lastName();
  const subscriptionStatus = simpleFaker.helpers.arrayElement<SubscriptionStatus | null>([
    ...Object.values(SubscriptionStatus),
    null,
  ]);
  const now = new Date();
  const createdAt = simpleFaker.date.between({ from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), to: now });
  const timePaid = simpleFaker.date.between({ from: createdAt, to: now });
  const credits = subscriptionStatus ? 0 : simpleFaker.number.int({ min: 0, max: 10 });
  const hasUserPaidOnStripe = !!subscriptionStatus || credits > 3;
  return {
    email: simpleFaker.internet.email({ firstName, lastName }),
    username: simpleFaker.internet.userName({ firstName, lastName }),
    createdAt,
    isAdmin: false,
    credits,
    subscriptionStatus,
    lemonSqueezyCustomerPortalUrl: null,
    paymentProcessorUserId: hasUserPaidOnStripe ? `cus_test_${simpleFaker.string.uuid()}` : null,
    datePaid: hasUserPaidOnStripe ? simpleFaker.date.between({ from: createdAt, to: timePaid }) : null,
    subscriptionPlan: subscriptionStatus ? simpleFaker.helpers.arrayElement(getSubscriptionPaymentPlanIds()) : null,
    clubId: null, // Users created by seed don't belong to any club initially
  };
}
