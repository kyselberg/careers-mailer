CREATE TABLE `emails` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `emails_hash_unique` ON `emails` (`hash`);