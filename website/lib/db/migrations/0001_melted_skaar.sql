CREATE TABLE IF NOT EXISTS "chapter_contents" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"caption" text,
	"chapter_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapters" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"lesson_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_objectives" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"objective" text NOT NULL,
	"rank" integer NOT NULL,
	"course_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"repo_link" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lesson_objectives" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"objective" text NOT NULL,
	"rank" integer NOT NULL,
	"lesson_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lesson_references" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"link" text,
	"lesson_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lessons" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"rank" text NOT NULL,
	"course_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "course_objectives_rank_idx" ON "course_objectives" ("rank");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "lesson_objectives_rank_idx" ON "lesson_objectives" ("rank");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "lessons_rank_idx" ON "lessons" ("rank");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapter_contents" ADD CONSTRAINT "chapter_contents_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapters" ADD CONSTRAINT "chapters_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_objectives" ADD CONSTRAINT "course_objectives_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_objectives" ADD CONSTRAINT "lesson_objectives_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lesson_references" ADD CONSTRAINT "lesson_references_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
