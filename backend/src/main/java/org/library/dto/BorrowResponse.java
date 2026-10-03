package org.library.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

public record BorrowResponse(@Schema(requiredMode = Schema.RequiredMode.REQUIRED) Long id,
                             @Schema(requiredMode = Schema.RequiredMode.REQUIRED) UserResponse userResponse,
                             @Schema(requiredMode = Schema.RequiredMode.REQUIRED) BookResponse bookResponse,
                             @Schema(requiredMode = Schema.RequiredMode.REQUIRED) LocalDate borrowDate,
                             @Schema(requiredMode = Schema.RequiredMode.REQUIRED) LocalDate dueDate,
                             LocalDate returnDate)
{
}