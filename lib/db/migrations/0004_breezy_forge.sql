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
ALTER TABLE "vulnerabilities" ADD CONSTRAINT "vulnerabilities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;