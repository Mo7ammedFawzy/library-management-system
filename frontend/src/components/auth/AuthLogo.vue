<template>
  <RouterLink
    to="/login"
    class="inline-flex items-center gap-2.5 select-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ca9ce]"
    aria-label="Athenaeum home"
  >
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#173b70] text-[#f5c54a] shadow-[0_6px_14px_rgba(23,59,112,0.22)] ring-1 ring-[#132f57]">
      <UIcon
        name="i-lucide-book-open"
        class="size-4"
        aria-hidden="true"
      />
    </span>
    <span class="text-[17px] font-semibold tracking-tight text-[#132f57] leading-none">
      Athenaeum
    </span>
  </RouterLink>
</template>
