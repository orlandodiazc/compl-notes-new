package ditod.compl_notes.web;

import ditod.compl_notes.domain.user.UserService;
import ditod.compl_notes.domain.user.dto.UserFilteredResponse;
import ditod.compl_notes.domain.user.dto.UserSummaryResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "user", description = "Everything about users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    ResponseEntity<List<UserFilteredResponse>> listUsers(
            @RequestParam(required = false, defaultValue = "") String search) {
        return ResponseEntity.ok(userService.findFilteredUsers(search));
    }

    @GetMapping("/{username}")
    ResponseEntity<UserSummaryResponse> getUser(@PathVariable String username) {
        return ResponseEntity.ok(userService.findByUsername(username, UserSummaryResponse.class));

    }

}
