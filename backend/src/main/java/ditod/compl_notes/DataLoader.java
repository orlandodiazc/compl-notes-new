package ditod.compl_notes;

import ditod.compl_notes.domain.note.Note;
import ditod.compl_notes.domain.note.NoteRepository;
import ditod.compl_notes.domain.note_image.NoteImage;
import ditod.compl_notes.domain.note_image.NoteImageRepository;
import ditod.compl_notes.domain.user.User;
import ditod.compl_notes.domain.user.UserRepository;
import ditod.compl_notes.domain.user_image.UserImage;
import ditod.compl_notes.domain.user_image.UserImageRepository;
import net.datafaker.Faker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@Component
@Profile("disabled")
public class DataLoader implements ApplicationRunner {
    @Value("${data-loader.images.directory}")
    private String IMAGES_DIRECTORY;

    private final UserRepository userRepository;

    private final UserImageRepository userImageRepository;

    private final NoteRepository noteRepository;

    private final NoteImageRepository noteImageRepository;

    public DataLoader(UserRepository userRepository, UserImageRepository userImageRepository, NoteRepository noteRepository, NoteImageRepository noteImageRepository) {
        this.userRepository = userRepository;
        this.userImageRepository = userImageRepository;
        this.noteRepository = noteRepository;
        this.noteImageRepository = noteImageRepository;
    }

    private byte[] readFileBytes(File file) {
        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

        List<ImageFile> noteImagesFile = List.of(new ImageFile("a nice country house", new File(IMAGES_DIRECTORY + "/notes/0.png")), new ImageFile("a city scape", new File(IMAGES_DIRECTORY + "/notes/1.png")), new ImageFile("a sunrise", new File(IMAGES_DIRECTORY + "/notes/2.png")));
        List<ImageBytes> noteImages = noteImagesFile.stream().map(i -> new ImageBytes(i.altText(), readFileBytes(i.file()))).toList();

        Faker faker = new Faker();

        for (int i = 0; i < 3; i++) {
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String username = (faker.letterify("??") + firstName.substring(0, Math.min(3, firstName.length())) + lastName.substring(0, Math.min(3, lastName.length()))).toLowerCase();
            String name = firstName + " " + lastName;
            String email = username + "@example.com";

            User newUser = new User(email, username, name);
            File userImageFile = new File(IMAGES_DIRECTORY + "/user/" + i + ".jpg");
            byte[] userImageContent = readFileBytes(userImageFile);
            UserImage newUserImage = new UserImage(username, Files.probeContentType(userImageFile.toPath()), userImageContent, newUser);

            userRepository.save(newUser);
            userImageRepository.save(newUserImage);

            for (int j = 0; j < faker.number().numberBetween(1, noteImagesFile.size()); j++) {
                String noteContent = faker.lorem().paragraph();
                String noteTitle = faker.lorem().sentence();
                Note newNote = new Note(noteTitle.substring(0, Math.min(10, noteContent.length())), noteContent.substring(0, Math.min(100, noteContent.length())), newUser);
                byte[] newNoteImageContent = noteImages.get(j).file();
                NoteImage newNoteImage = new NoteImage(noteImagesFile.get(j).altText(), Files.probeContentType(noteImagesFile.get(j).file().toPath()), newNoteImageContent, newNote);
                noteRepository.save(newNote);
                noteImageRepository.save(newNoteImage);
            }

        }

        File adminImageFile = new File(IMAGES_DIRECTORY + "/user/admin.jpg");
        byte[] adminImageContent = readFileBytes(adminImageFile);
        User admin = new User("admin@example.com", "admin", "Orlando Diaz");
        UserImage adminImage = new UserImage("Dito's profile picture", Files.probeContentType(adminImageFile.toPath()), adminImageContent, admin);

        Note adminNote = new Note("Tiger", "Tigers are great", admin);
        File adminNoteImageFile = new File(IMAGES_DIRECTORY + "/admin-notes/cute-koala.png");
        byte[] adminNoteImageContent = readFileBytes(adminNoteImageFile);
        NoteImage adminNoteImage = new NoteImage("Cute looking koala", Files.probeContentType(adminNoteImageFile.toPath()), adminNoteImageContent, adminNote);

        userRepository.save(admin);
        userImageRepository.save(adminImage);
        noteRepository.save(adminNote);
        noteImageRepository.save(adminNoteImage);
    }

    record ImageFile(String altText, File file) {
    }

    record ImageBytes(String altText, byte[] file) {
    }
}
