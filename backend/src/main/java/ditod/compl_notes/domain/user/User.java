package ditod.compl_notes.domain.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import ditod.compl_notes.domain.DateTimeAudit;
import ditod.compl_notes.domain.note.Note;
import ditod.compl_notes.domain.user_image.UserImage;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.ColumnTransformer;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User extends DateTimeAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    @NotNull
    @ColumnTransformer(write = "LOWER(?)")
    private String email;

    @Column(unique = true)
    @NotNull
    @ColumnTransformer(write = "LOWER(?)")
    private String username;

    private String name;

    @NotNull
    @JsonManagedReference
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Note> notes = new ArrayList<>();

    @JsonManagedReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserImage image;

    public User() {
    }

    public User(String email, String username, String name) {
        this.email = email;
        this.username = username;
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    public UserImage getImage() {
        return image;
    }

    public void setImage(UserImage image) {
        this.image = image;
    }
}
