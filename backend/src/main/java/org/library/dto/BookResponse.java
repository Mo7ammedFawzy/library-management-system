package org.library.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record BookResponse(@Schema(requiredMode = Schema.RequiredMode.REQUIRED) Long id,
                           @Schema(requiredMode = Schema.RequiredMode.REQUIRED) String title,
                           String description,
                           @Schema(requiredMode = Schema.RequiredMode.REQUIRED) Long availableCopies,
                           @Schema(requiredMode = Schema.RequiredMode.REQUIRED) CategoryResponse category,
                           @Schema(requiredMode = Schema.RequiredMode.REQUIRED) List<AuthorResponse> authors)
{
}