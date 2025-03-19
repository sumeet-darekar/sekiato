CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"repository" varchar(255) NOT NULL,
	"code" text,
	"last_scan" timestamp DEFAULT now(),
	"status" varchar(50) DEFAULT 'pending',
	"issues" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"status" varchar(50) DEFAULT 'pending',
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "vulnerabilities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid,
	"title" varchar(255) NOT NULL,
	"severity" varchar(50) NOT NULL,
	"description" text,
	"code" text,
	"location" varchar(255),
	"status" varchar(50) DEFAULT 'open',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "scans" ADD CONSTRAINT "scans_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vulnerabilities" ADD CONSTRAINT "vulnerabilities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;