package org.library.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import org.library.payload.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController
{
	@GetMapping
	@SecurityRequirements
	public ResponseEntity<ApiResponse<String>> health()
	{
		return ApiResponse.okResponse("Backend is running");
	}
}
