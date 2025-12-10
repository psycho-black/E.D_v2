import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const patients = sqliteTable('patients', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email'),
    phone: text('phone'),
    status: text('status').default('Active'), // Active, Archived
    lastVisit: text('last_visit'),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
});

export const appointments = sqliteTable('appointments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    patientId: integer('patient_id').references(() => patients.id),
    date: text('date').notNull(),
    time: text('time').notNull(),
    status: text('status').default('Scheduled'), // Scheduled, Completed, Cancelled
    type: text('type').default('Consulta General'),
});
