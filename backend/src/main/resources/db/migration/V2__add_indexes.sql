-- CreateIndex for Note on ownerId: When finding notes by owner
CREATE INDEX "note_owner_id_key" ON "note" ("owner_id");

-- CreateIndex for NoteImage on noteId: When finding note images by noteId
CREATE INDEX "note_image_note_id_key" ON "note_image" ("note_id");

-- CreateIndex for Note on ownerId and updatedAt: When searching users and ordering by latest updates
CREATE INDEX "note_owner_id_updated_at_key" ON "note" ("owner_id", "updated_at");
