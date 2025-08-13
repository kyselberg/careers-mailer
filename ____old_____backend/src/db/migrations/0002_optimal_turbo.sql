PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_emails` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hash` text NOT NULL,
	`title` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_emails`("id", "email", "hash", "title") SELECT "id", "email", "hash", "title" FROM `emails`;--> statement-breakpoint
DROP TABLE `emails`;--> statement-breakpoint
ALTER TABLE `__new_emails` RENAME TO `emails`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `emails_hash_unique` ON `emails` (`hash`);