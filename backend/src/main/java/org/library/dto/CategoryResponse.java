package org.library.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record CategoryResponse(@Schema(requiredMode = Schema.RequiredMode.REQUIRED) Long id,
                               @Schema(requiredMode = Schema.RequiredMode.REQUIRED) String name)
{
}