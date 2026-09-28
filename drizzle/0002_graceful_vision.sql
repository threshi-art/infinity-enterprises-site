CREATE TABLE `page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`day` text NOT NULL,
	`referrer_domain` text,
	`created_at` text NOT NULL
);
