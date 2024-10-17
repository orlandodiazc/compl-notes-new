package ditod.compl_notes.domain.note;

import ditod.compl_notes.domain.exception.EntityNotFoundException;
import ditod.compl_notes.domain.note.dto.NoteRequest;
import ditod.compl_notes.domain.note.dto.NoteSummaryResponse;
import ditod.compl_notes.domain.note_image.NoteImage;
import ditod.compl_notes.domain.note_image.NoteImageRepository;
import ditod.compl_notes.domain.note_image.dto.NoteImageRequest;
import ditod.compl_notes.domain.user.User;
import ditod.compl_notes.domain.user.UserRepository;
import ditod.compl_notes.domain.user.dto.UserNotesResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final UserRepository userRepository;

    private final NoteRepository noteRepository;

    private final NoteImageRepository noteImageRepository;

    public NoteService(UserRepository userRepository, NoteRepository noteRepository, NoteImageRepository noteImageRepository) {
        this.userRepository = userRepository;
        this.noteRepository = noteRepository;
        this.noteImageRepository = noteImageRepository;
    }

    public UserNotesResponse findAll(String username) {
        return userRepository.findByUsernameIgnoreCase(username, UserNotesResponse.class).orElseThrow(() -> new EntityNotFoundException("username", username));
    }

    public NoteSummaryResponse findNoteSummaryById(UUID noteId) {
        return noteRepository.findById(noteId, NoteSummaryResponse.class).orElseThrow(() -> new EntityNotFoundException("note", noteId));
    }

    Optional<Note> findNoteById(UUID noteId) {
        return noteRepository.findById(noteId, Note.class);
    }

    public Note save(Note note) {
        return noteRepository.save(note);
    }

    public void deleteById(UUID noteId) {
        noteRepository.deleteById(noteId);
    }

    public Note updateNote(NoteRequest newNote, UUID noteId, User owner) {
        return this.findNoteById(noteId).map(note -> {
            note.setTitle(newNote.getTitle());
            note.setContent(newNote.getContent());
            var newNoteImages = newNote.getImages();
            if (newNoteImages != null && !newNoteImages.isEmpty()) {
                List<NoteImage> imageUpdates = this.convertMultipartFilesToNoteImage(newNoteImages, note);

                noteImageRepository.deleteByIdNotIn(imageUpdates.stream().map(NoteImage::getId).collect(Collectors.toList()));

                noteImageRepository.saveAll(imageUpdates);
            } else {
                noteImageRepository.deleteByNote(note);
            }

            return this.save(note);
        }).orElseGet(() -> {
            Note createdNote = this.save(new Note(newNote.getTitle(), newNote.getContent(), owner));
            createdNote.setImages(this.convertMultipartFilesToNoteImage(newNote.getImages(), createdNote));
            return this.save(createdNote);
        });
    }

    public List<NoteImage> convertMultipartFilesToNoteImage(List<NoteImageRequest> images, Note note) {

        return images.stream().map(image -> processNoteImage(image, note)).filter(Objects::nonNull).toList();
    }

    private NoteImage processNoteImage(NoteImageRequest requestImage, Note note) {
        try {
            if (requestImage.getId() != null) {
                return updateNoteImage(requestImage);
            } else if (requestImage.getFile() != null && !requestImage.getFile().isEmpty()) {
                return createNoteImage(requestImage, note);
            }
            return null;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private NoteImage updateNoteImage(NoteImageRequest requestImage) throws IOException {
        NoteImage noteImageToUpdate = noteImageRepository.findById(requestImage.getId()).orElseThrow(() -> new EntityNotFoundException("image", requestImage.getId()));
        noteImageToUpdate.setAltText(requestImage.getAltText());
        if (requestImage.getFile() != null && !requestImage.getFile().isEmpty()) {
            noteImageToUpdate.setContentType(requestImage.getFile().getContentType());
            noteImageToUpdate.setBlob(requestImage.getFile().getBytes());
        }
        return noteImageToUpdate;
    }

    private NoteImage createNoteImage(NoteImageRequest requestImage, Note note) throws IOException {
        return new NoteImage(requestImage.getAltText(), requestImage.getFile().getContentType(), requestImage.getFile().getBytes(), note);
    }
}
