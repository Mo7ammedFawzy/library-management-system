package org.library.controller;

import org.library.dto.DashboardResponse;
import org.library.payload.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController
{

	@GetMapping("/summary")
	public ResponseEntity<ApiResponse<DashboardResponse>> summary()
	{

	}

}
