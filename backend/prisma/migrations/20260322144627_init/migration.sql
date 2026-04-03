-- CreateTable
CREATE TABLE "Perfume" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "country" TEXT,
    "gender" TEXT,
    "year" INTEGER,
    "ratingValue" DOUBLE PRECISION,
    "ratingCount" INTEGER,
    "perfumer1" TEXT,
    "perfumer2" TEXT,

    CONSTRAINT "Perfume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfumeNote" (
    "perfumeId" INTEGER NOT NULL,
    "noteId" INTEGER NOT NULL,
    "layer" TEXT NOT NULL,

    CONSTRAINT "PerfumeNote_pkey" PRIMARY KEY ("perfumeId","noteId","layer")
);

-- CreateTable
CREATE TABLE "Accord" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Accord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfumeAccord" (
    "perfumeId" INTEGER NOT NULL,
    "accordId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "PerfumeAccord_pkey" PRIMARY KEY ("perfumeId","accordId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "perfumeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Note_name_key" ON "Note"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Accord_name_key" ON "Accord"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionEntry_userId_perfumeId_key" ON "CollectionEntry"("userId", "perfumeId");

-- AddForeignKey
ALTER TABLE "PerfumeNote" ADD CONSTRAINT "PerfumeNote_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "Perfume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfumeNote" ADD CONSTRAINT "PerfumeNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfumeAccord" ADD CONSTRAINT "PerfumeAccord_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "Perfume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfumeAccord" ADD CONSTRAINT "PerfumeAccord_accordId_fkey" FOREIGN KEY ("accordId") REFERENCES "Accord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionEntry" ADD CONSTRAINT "CollectionEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionEntry" ADD CONSTRAINT "CollectionEntry_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "Perfume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
