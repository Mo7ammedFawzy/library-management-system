package org.library.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthResponse(@Schema(requiredMode = Schema.RequiredMode.REQUIRED) String token)
{
}