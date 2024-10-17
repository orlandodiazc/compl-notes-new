package ditod.compl_notes.web;

import ditod.compl_notes.domain.exception.EntityNotFoundException;
import ditod.compl_notes.domain.user_image.UserImage;
import ditod.compl_notes.domain.user_image.UserImageRepository;
import ditod.compl_notes.utils.ImageUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/user-images")
@Tag(name = "user image", description = "Access user images")
public class UserImageController {
    private final UserImageRepository userImageRepository;

    private final ImageUtils imageUtils;

    public UserImageController(UserImageRepository userImageRepository,
                               ImageUtils imageUtils) {
        this.userImageRepository = userImageRepository;
        this.imageUtils = imageUtils;
    }

    @GetMapping("/{imageId}")
    ResponseEntity<byte[]> getUserImage(@PathVariable UUID imageId) {
        UserImage userImage = userImageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("user image", imageId));

        return ResponseEntity.ok()
                .headers(imageUtils.getImageResponseHeaders(userImage.getId(), userImage.getContentType(), userImage.getBlob().length))
                .body(userImage.getBlob());
    }
}



