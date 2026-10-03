package org.library.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig
{
	private static final String BEARER_SCHEME = "bearerAuth";

	@Bean
	public OpenAPI libraryOpenAPI()
	{
		return new OpenAPI()
				.info(new Info()
						.title("Library Management API")
						.description("REST API for the Library Management System")
						.version("v1"))
				.addServersItem(new Server().url("/").description("Current host"))
				.addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
				.components(new Components()
						.addSecuritySchemes(BEARER_SCHEME, new SecurityScheme()
								.name(BEARER_SCHEME)
								.type(SecurityScheme.Type.HTTP)
								.scheme("bearer")
								.bearerFormat("JWT")));
	}
}