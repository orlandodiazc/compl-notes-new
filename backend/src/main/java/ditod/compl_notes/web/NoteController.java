package ditod.compl_notes.web;

import ditod.compl_notes.domain.note.Note;
import ditod.compl_notes.domain.note.NoteService;
import ditod.compl_notes.domain.note.dto.NoteRequest;
import ditod.compl_notes.domain.note.dto.NoteSummaryResponse;
import ditod.compl_notes.domain.note_image.NoteImage;
import ditod.compl_notes.domain.note_image.NoteImageRepository;
import ditod.compl_notes.domain.user.User;
import ditod.compl_notes.domain.user.UserService;
import ditod.compl_notes.domain.user.dto.UserNotesResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users/{username}/notes")
@Tag(name = "note", description = "Access user notes")
public class NoteController {
    private final NoteService noteService;

    private final UserService userService;

    private final NoteImageRepository noteImageRepository;

    public NoteController(NoteService noteService, UserService userService,
                          NoteImageRepository noteImageRepository) {
        this.noteService = noteService;
        this.userService = userService;
        this.noteImageRepository = noteImageRepository;
    }

    @GetMapping
    ResponseEntity<UserNotesResponse> allNotes(@PathVariable String username) {
        return ResponseEntity.ok(noteService.findAll(username));
    }

    @GetMapping("/{noteId}")
    ResponseEntity<NoteSummaryResponse> getNote(@PathVariable UUID noteId) {
        return ResponseEntity.ok(noteService.findNoteSummaryById(noteId));
    }

    @PostMapping
    ResponseEntity<Note> createNote(@Valid @ModelAttribute NoteRequest note,
                                    @PathVariable String username) {
        User user = userService.findByUsername(username);
        Note savedNote = noteService.save(new Note(note.getTitle(), note.getContent(), user));
        List<NoteImage> images = noteService.convertMultipartFilesToNoteImage(note.getImages(), savedNote);
        noteImageRepository.saveAll(images);
        return ResponseEntity.ok(savedNote);
    }

    @DeleteMapping("/{noteId}")
    ResponseEntity<Void> deleteNote(@PathVariable String username,
                                    @PathVariable UUID noteId) {
        userService.findByUsername(username);
        noteService.deleteById(noteId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{noteId}")
    ResponseEntity<Note> updateNote(@Valid @ModelAttribute NoteRequest newNote,
                                    @PathVariable String username, @PathVariable UUID noteId) {
        User owner = userService.findByUsername(username);
        Note replacedOrNewNote = noteService.updateNote(newNote, noteId, owner);
        return ResponseEntity.ok(replacedOrNewNote);
    }
}