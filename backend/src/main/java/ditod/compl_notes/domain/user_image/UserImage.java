package ditod.compl_notes.domain.user_image;

import ditod.compl_notes.domain.DateTimeAudit;
import ditod.compl_notes.domain.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@Entity
public class UserImage extends DateTimeAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String altText;
    @NotNull
    private String contentType;
    @NotNull
    private byte[] blob;
    @NotNull
    @OneToOne
    @JoinColumn(name = "userId")
    @JsonBackReference
    private User user;

    public UserImage() {
    }

    public UserImage(String altText, String contentType, byte[] blob,
            User user) {
        this.altText = altText;
        this.contentType = contentType;
        this.blob = blob;
        this.user = user;
    }

    public UUID getId() {
        return id;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public byte[] getBlob() {
        return blob;
    }

    public void setBlob(byte[] blob) {
        this.blob = blob;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
