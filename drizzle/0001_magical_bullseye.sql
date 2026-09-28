CREATE TABLE `feed_snapshots` (
	`source_id` text PRIMARY KEY NOT NULL,
	`items_json` text NOT NULL,
	`fetched_at` text,
	`last_attempt_at` text NOT NULL,
	`last_error` text
);
