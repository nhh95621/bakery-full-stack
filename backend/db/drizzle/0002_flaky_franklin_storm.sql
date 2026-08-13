CREATE TABLE `customerReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`title` varchar(160),
	`content` text NOT NULL,
	`verifiedPurchase` boolean NOT NULL DEFAULT true,
	`approved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customerReviews_id` PRIMARY KEY(`id`)
);
