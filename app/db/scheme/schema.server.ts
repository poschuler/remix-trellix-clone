import { integer, text, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const boards = sqliteTable("boards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const boardsRelations = relations(boards, ({ many }) => ({
  columns: many(columns),
}));

export const columns = sqliteTable("columns", {
  id: text("id").primaryKey().default("uuid()"),
  name: text("name").notNull(),
  order: real("order").notNull(),
  boardId: integer("boardId")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
});

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.boardId],
    references: [boards.id],
  }),
  items: many(items),
}));

export const items = sqliteTable("items", {
  id: text("id").primaryKey().default("uuid()"),
  content: text("content").notNull(),
  order: real("order").notNull(),
  columnId: text("columnId")
    .notNull()
    .references(() => columns.id, { onDelete: "cascade" }),
});

export const itemsRelations = relations(items, ({ one }) => ({
  column: one(columns, {
    fields: [items.columnId],
    references: [columns.id],
  }),
}));
