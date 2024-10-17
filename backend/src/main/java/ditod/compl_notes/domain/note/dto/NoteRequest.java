package ditod.compl_notes.domain.note.dto;

import ditod.compl_notes.domain.note_image.dto.NoteImageRequest;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class NoteRequest {
    @NotNull(message = "Title is required")
    @Size(min = 1, max = 50, message = "Title length must be between 1 and 100 characters")
    private String title;
    @NotNull(message = "Content is required")
    @Size(min = 1, max = 1000, message = "Content length must be between 1 and 10000 characters")
    private String content;
    @Size(max = 5, message = "The maximum number of images is 5")
    private List<NoteImageRequest> images;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<NoteImageRequest> getImages() {
        return images;
    }

    public void setImages(List<NoteImageRequest> images) {
        this.images = images;
    }
}
