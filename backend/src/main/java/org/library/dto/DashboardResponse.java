package org.library.dto;

public record DashboardResponse(Long totalBooks, Long availableCopies, Long activeBorrowings, Long availabilityRate, Long totalAuthors,
                                List<ActivityResponse> weeklyActivity)
{
}
