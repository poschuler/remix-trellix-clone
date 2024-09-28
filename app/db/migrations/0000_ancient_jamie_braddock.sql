CREATE TABLE `boards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `columns` (
	`id` text PRIMARY KEY DEFAULT 'uuid()' NOT NULL,
	`name` text NOT NULL,
	`order` real NOT NULL,
	`boardId` integer NOT NULL,
	FOREIGN KEY (`boardId`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY DEFAULT 'uuid()' NOT NULL,
	`content` text NOT NULL,
	`order` real NOT NULL,
	`columnId` text NOT NULL,
	FOREIGN KEY (`columnId`) REFERENCES `columns`(`id`) ON UPDATE no action ON DELETE cascade
);
