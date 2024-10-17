package ditod.compl_notes.domain.user.dto;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@Hidden
public interface UserBaseResponse {
    @NotNull UUID getId();

    @NotNull String getUsername();

    String getName();

    UserImageSummary getImage();

    interface UserImageSummary {
        @NotNull UUID getId();
    }
}
