package org.library.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserResponse(@Schema(requiredMode = Schema.RequiredMode.REQUIRED) Long id,
                           @Schema(requiredMode = Schema.RequiredMode.REQUIRED) String name,
                           @Schema(requiredMode = Schema.RequiredMode.REQUIRED) String email,
                           @Schema(requiredMode = Schema.RequiredMode.REQUIRED) String role)
{

}