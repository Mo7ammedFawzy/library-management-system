package org.library.dto;

import org.library.enums.Role;

public record CurrentUserResponse(Long id, String name, String email, Role role)
{
}
