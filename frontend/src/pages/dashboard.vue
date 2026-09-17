<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchBooks } from '../services/books'
import { fetchBorrowings, getStatus, formatDate } from '../services/borrowings'
import { fetchCategories } from '../services/categories'
import { fetchAuthors } from '../services/authors'
import type { Book } from '../services/books'
import type { Borrowing, BorrowingStatus } from '../services/borrowings'
import type { Category } from '../services/categories'

const books = ref<Book[]>([])
const borrowings = ref<Borrowing[]>([])
const categories = ref<Category[]>([])
const authorCount = ref(0)

onMounted(async () => {
  const [b, br, c, a] = await Promise.all([
    fetchBooks(),
    fetchBorrowings(),
    fetchCategories(),
    fetchAuthors()
  ])
  books.value = b
  borrowings.value = br
  categories.value = c
  authorCount.value = a.length
})

const totalBooks = computed(() => books.value.length)
const totalMembers = computed(() => {
  const unique = new Set(borrowings.value.map(b => b.user.id))
  return unique.size
})
const activeBorrowings = computed(() =>
  borrowings.value.filter(b => !b.returnDate).length
)
const overdueBooks = computed(() =>
  borrowings.value.filter(b => getStatus(b) === 'Overdue').length
)

const categoryBreakdown = computed(() => {
  const counts = new Map<string, number>()
  for (const book of books.value) {
    const name = book.category?.name ?? 'Other'
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  const colors = ['#9f3c11', '#2f6670', '#B7791F', '#2E7D32', '#C0392B', '#8a7269']
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], i) => ({
      name,
      count,
      pct: totalBooks.value ? Math.round((count / totalBooks.value) * 100) : 0,
      color: colors[i % colors.length]
    }))
})

const donutSegments = computed(() => {
  const circumference = 2 * Math.PI * 50 // ~314.16
  let offset = 0
  return categoryBreakdown.value.map(cat => {
    const len = (cat.pct / 100) * circumference
    const seg = { len, offset, color: cat.color }
    offset -= len
    return seg
  })
})

const recentBorrowings = computed(() =>
  borrowings.value
    .slice()
    .sort((a, b) => b.borrowDate.localeCompare(a.borrowDate))
    .slice(0, 5)
)

function statusStyle(status: BorrowingStatus) {
  switch (status) {
    case 'Returned':
    case 'Borrowed':
      return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'Due Today':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'Overdue':
      return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-stone-100 text-stone-600'
  }
}

function statusLabel(status: BorrowingStatus) {
  switch (status) {
    case 'Borrowed': return 'On Time'
    case 'Due Today': return 'Due Soon'
    default: return status
  }
}

const topBorrowedBooks = computed(() => {
  const counts = new Map<number, { book: Book; count: number }>()
  for (const b of borrowings.value) {
    const existing = counts.get(b.book.id)
    if (existing) {
      existing.count++
    } else {
      counts.set(b.book.id, { book: b.book, count: 1 })
    }
  }
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const bookCoverColors = [
  'from-brand-700 to-brand-900',
  'from-stone-800 to-stone-950',
  'from-teal-700 to-stone-900',
  'from-red-900 to-amber-950',
  'from-amber-100 to-amber-300'
]

interface ActivityItem {
  icon: string
  iconBg: string
  iconColor: string
  title: string
  subtitle: string
  time: string
}

const recentActivity = computed<ActivityItem[]>(() => {
  const items: ActivityItem[] = []
  const sorted = borrowings.value
    .slice()
    .sort((a, b) => b.borrowDate.localeCompare(a.borrowDate))

  for (const b of sorted.slice(0, 5)) {
    if (b.returnDate) {
      items.push({
        icon: 'i-lucide-undo-2',
        iconBg: 'bg-teal-50 dark:bg-teal-900/30',
        iconColor: 'text-teal-600 dark:text-teal-400',
        title: 'Book returned',
        subtitle: b.book.title,
        time: formatRelative(b.returnDate)
      })
    } else if (getStatus(b) === 'Overdue') {
      items.push({
        icon: 'i-lucide-clock',
        iconBg: 'bg-red-50 dark:bg-red-900/30',
        iconColor: 'text-red-600 dark:text-red-400',
        title: 'Overdue reminder',
        subtitle: b.book.title,
        time: formatRelative(b.borrowDate)
      })
    } else {
      items.push({
        icon: 'i-lucide-book-open',
        iconBg: 'bg-amber-50 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        title: 'Book borrowed',
        subtitle: b.book.title,
        time: formatRelative(b.borrowDate)
      })
    }
  }
  return items
})

function formatRelative(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

function bookInitials(title: string): string {
  return title.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3)
}
</script>

<template>
  <div class="flex flex-col gap-6 overflow-y-auto pb-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="font-display text-2xl font-bold tracking-tight text-highlighted">
        Welcome back, Mohammed
      </h1>
      <p class="mt-0.5 text-xs text-muted">
        Here's what's happening with your library today.
      </p>
    </div>

    <!-- KPI Metric Cards -->
    <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Books -->
      <div class="relative flex items-center gap-4 overflow-hidden rounded-xl bg-(--ui-bg-card) p-4 shadow-sm ring-1 ring-(--ui-border)">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <UIcon name="i-lucide-book-open" class="size-6" />
        </div>
        <div>
          <p class="text-xs font-medium text-muted">Total Books</p>
          <h3 class="mt-0.5 font-display text-2xl font-bold text-highlighted">{{ totalBooks }}</h3>
        </div>
      </div>
      <!-- Total Members -->
      <div class="relative flex items-center gap-4 overflow-hidden rounded-xl bg-(--ui-bg-card) p-4 shadow-sm ring-1 ring-(--ui-border)">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <UIcon name="i-lucide-users" class="size-6" />
        </div>
        <div>
          <p class="text-xs font-medium text-muted">Total Members</p>
          <h3 class="mt-0.5 font-display text-2xl font-bold text-highlighted">{{ totalMembers }}</h3>
        </div>
      </div>
      <!-- Active Borrowings -->
      <div class="relative flex items-center gap-4 overflow-hidden rounded-xl bg-(--ui-bg-card) p-4 shadow-sm ring-1 ring-(--ui-border)">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <UIcon name="i-lucide-arrow-left-right" class="size-6" />
        </div>
        <div>
          <p class="text-xs font-medium text-muted">Active Borrowings</p>
          <h3 class="mt-0.5 font-display text-2xl font-bold text-highlighted">{{ activeBorrowings }}</h3>
        </div>
      </div>
      <!-- Overdue Books -->
      <div class="relative flex items-center gap-4 overflow-hidden rounded-xl bg-(--ui-bg-card) p-4 shadow-sm ring-1 ring-(--ui-border)">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <UIcon name="i-lucide-calendar-clock" class="size-6" />
        </div>
        <div>
          <p class="text-xs font-medium text-muted">Overdue Books</p>
          <h3 class="mt-0.5 font-display text-2xl font-bold text-highlighted">{{ overdueBooks }}</h3>
        </div>
      </div>
    </section>

    <!-- Charts Row -->
    <section class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <!-- Book Categories Donut -->
      <div class="flex flex-col justify-between rounded-xl bg-(--ui-bg-card) p-5 shadow-sm ring-1 ring-(--ui-border) lg:col-span-5">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-highlighted">Book Categories</h2>
        </div>
        <div class="my-auto flex items-center justify-between gap-4">
          <!-- Donut Chart -->
          <div class="relative flex size-44 shrink-0 items-center justify-center">
            <svg class="-rotate-90 size-full" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="50" fill="none" stroke="currentColor" stroke-width="18" class="text-stone-100 dark:text-stone-800" />
              <circle
                v-for="(seg, i) in donutSegments"
                :key="i"
                cx="70"
                cy="70"
                r="50"
                fill="none"
                :stroke="seg.color"
                stroke-width="18"
                :stroke-dasharray="`${seg.len} 314.16`"
                :stroke-dashoffset="seg.offset"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-xl font-bold leading-none text-highlighted">{{ totalBooks }}</span>
              <span class="mt-0.5 text-[10px] font-normal text-dimmed">Total Books</span>
            </div>
          </div>
          <!-- Legend -->
          <div class="flex-1 space-y-1.5 text-xs">
            <div
              v-for="cat in categoryBreakdown"
              :key="cat.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span class="size-2.5 rounded-full" :style="{ backgroundColor: cat.color }" />
                <span class="text-[11px] text-muted">{{ cat.name }}</span>
              </div>
              <div class="text-[11px] font-medium text-highlighted">
                {{ cat.count }}
                <span class="font-normal text-dimmed">({{ cat.pct }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Borrowing Status Chart Placeholder -->
      <div class="flex flex-col justify-between rounded-xl bg-(--ui-bg-card) p-5 shadow-sm ring-1 ring-(--ui-border) lg:col-span-7">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-highlighted">Borrowing Status</h2>
          <div class="flex items-center rounded-lg bg-(--ui-bg-accented) p-0.5 text-xs">
            <button class="rounded-md bg-(--ui-bg-card) px-3 py-1 text-[11px] font-medium text-highlighted shadow-xs">
              This Week
            </button>
            <button class="px-3 py-1 text-[11px] text-muted hover:text-highlighted">
              This Month
            </button>
          </div>
        </div>
        <!-- Simple SVG line chart -->
        <div class="flex h-44 w-full items-end pb-1 pt-4">
          <div class="flex h-full flex-col justify-between pb-5 pr-3 text-right text-[10px] font-medium text-dimmed">
            <span>40</span>
            <span>30</span>
            <span>20</span>
            <span>10</span>
            <span>0</span>
          </div>
          <div class="relative flex h-full flex-1 flex-col">
            <!-- Grid lines -->
            <div class="pointer-events-none absolute inset-0 flex flex-col justify-between pb-5">
              <div class="w-full border-b border-(--ui-border-muted)" />
              <div class="w-full border-b border-(--ui-border-muted)" />
              <div class="w-full border-b border-(--ui-border-muted)" />
              <div class="w-full border-b border-(--ui-border-muted)" />
              <div class="w-full border-b border-(--ui-border)" />
            </div>
            <!-- Line Graph -->
            <div class="relative h-[calc(100%-20px)] w-full">
              <svg class="size-full overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#9f3c11" stop-opacity="0.18" />
                    <stop offset="100%" stop-color="#9f3c11" stop-opacity="0.01" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#areaGrad)"
                  points="15,85 105,62 195,54 285,68 375,48 465,65 555,22 555,120 15,120"
                />
                <polyline
                  fill="none"
                  points="15,85 105,62 195,54 285,68 375,48 465,65 555,22"
                  stroke="#9f3c11"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                />
                <circle v-for="(pt, i) in [[15,85],[105,62],[195,54],[285,68],[375,48],[465,65],[555,22]]" :key="i" :cx="pt[0]" :cy="pt[1]" r="3.5" fill="#9f3c11" stroke="white" stroke-width="2" />
              </svg>
            </div>
            <!-- X-Axis Labels -->
            <div class="flex justify-between px-1 pt-1 text-[11px] font-medium text-dimmed">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Row: Tables & Activity -->
    <section class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <!-- Top Borrowed Books -->
      <div class="flex flex-col justify-between rounded-xl bg-(--ui-bg-card) p-5 shadow-sm ring-1 ring-(--ui-border) lg:col-span-4">
        <div>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-highlighted">Top Borrowed Books</h2>
            <RouterLink to="/books" class="text-xs font-medium text-primary hover:underline">
              View All
            </RouterLink>
          </div>
          <div class="space-y-3.5">
            <div
              v-for="(item, index) in topBorrowedBooks"
              :key="item.book.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-11 w-8 items-center justify-center rounded bg-gradient-to-br p-0.5 text-center text-[7px] font-bold leading-tight shadow-xs"
                  :class="[
                    bookCoverColors[index % bookCoverColors.length],
                    index === 4 ? 'text-amber-900 border border-amber-200' : 'text-white'
                  ]"
                >
                  {{ bookInitials(item.book.title) }}
                </div>
                <div>
                  <h4 class="text-xs font-semibold leading-tight text-highlighted">{{ item.book.title }}</h4>
                  <p class="text-[11px] text-dimmed">
                    {{ item.book.authors?.map(a => a.name).join(', ') || 'Unknown' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-right">
                  <span class="text-xs font-bold leading-tight text-highlighted">{{ item.count }}</span>
                  <span class="block -mt-0.5 text-[10px] text-dimmed">times</span>
                </div>
                <span
                  v-if="index === 0"
                  class="ml-1 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-600"
                >
                  Most Borrowed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Borrowings Table -->
      <div class="flex flex-col justify-between rounded-xl bg-(--ui-bg-card) p-5 shadow-sm ring-1 ring-(--ui-border) lg:col-span-5">
        <div>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-highlighted">Recent Borrowings</h2>
            <RouterLink to="/borrowings" class="text-xs font-medium text-primary hover:underline">
              View All
            </RouterLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-(--ui-border-muted) text-[11px] text-dimmed">
                  <th class="pb-2.5 font-medium">Book</th>
                  <th class="pb-2.5 font-medium">Member</th>
                  <th class="pb-2.5 font-medium">Due Date</th>
                  <th class="pb-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-(--ui-border-muted) text-xs">
                <tr v-for="b in recentBorrowings" :key="b.id">
                  <td class="flex items-center gap-2.5 py-2.5">
                    <div class="flex h-8 w-6 items-center justify-center rounded bg-stone-800 text-[6px] font-bold text-white dark:bg-stone-600">
                      {{ bookInitials(b.book.title) }}
                    </div>
                    <div>
                      <div class="text-[11px] font-medium leading-tight text-highlighted">{{ b.book.title }}</div>
                      <div class="text-[10px] leading-tight text-dimmed">
                        {{ b.book.authors?.map(a => a.name).join(', ') || '' }}
                      </div>
                    </div>
                  </td>
                  <td class="py-2.5 text-[11px] text-muted">{{ b.user.name }}</td>
                  <td class="py-2.5 text-[11px] text-dimmed">{{ formatDate(b.dueDate) }}</td>
                  <td class="py-2.5 text-right">
                    <span
                      class="rounded px-2 py-0.5 text-[10px] font-medium"
                      :class="statusStyle(getStatus(b))"
                    >
                      {{ statusLabel(getStatus(b)) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Activity + Quote -->
      <div class="flex flex-col gap-5 lg:col-span-3">
        <!-- Recent Activity -->
        <div class="flex-1 rounded-xl bg-(--ui-bg-card) p-5 shadow-sm ring-1 ring-(--ui-border)">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-highlighted">Recent Activity</h2>
          </div>
          <div class="space-y-3.5">
            <div
              v-for="(item, i) in recentActivity"
              :key="i"
              class="flex items-start justify-between"
            >
              <div class="flex items-start gap-2.5">
                <div
                  class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
                  :class="[item.iconBg]"
                >
                  <UIcon :name="item.icon" class="size-3.5" :class="item.iconColor" />
                </div>
                <div>
                  <p class="text-xs font-medium leading-tight text-highlighted">{{ item.title }}</p>
                  <p class="mt-0.5 text-[11px] leading-tight text-dimmed">{{ item.subtitle }}</p>
                </div>
              </div>
              <span class="shrink-0 text-[10px] text-dimmed">{{ item.time }}</span>
            </div>
          </div>
        </div>

        <!-- Quote Card -->
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-4 shadow-sm ring-1 ring-brand-100/70 dark:from-brand-950/40 dark:to-brand-900/20 dark:ring-brand-900/40">
          <div class="relative z-10">
            <div class="mb-1 flex items-center gap-1.5 text-brand-500">
              <UIcon name="i-lucide-book-open" class="size-4" />
            </div>
            <h3 class="max-w-[170px] text-xs font-semibold leading-snug text-highlighted">
              A good library builds a better tomorrow.
            </h3>
          </div>
          <!-- Decorative Books Illustration -->
          <div class="pointer-events-none absolute bottom-0 right-2">
            <svg width="105" height="85" viewBox="0 0 120 100" fill="none">
              <ellipse cx="65" cy="94" rx="45" ry="5" fill="currentColor" class="text-stone-300 dark:text-stone-700" opacity="0.6" />
              <rect x="25" y="80" width="75" height="12" rx="2" fill="#9f3c11" />
              <rect x="28" y="82" width="70" height="2" fill="#c95a2c" />
              <rect x="35" y="69" width="60" height="11" rx="2" fill="currentColor" class="text-stone-50 dark:text-stone-700" stroke="currentColor" stroke-width="1" />
              <rect x="38" y="72" width="5" height="5" fill="#2f6670" />
              <rect x="40" y="58" width="52" height="11" rx="2" fill="#9f3c11" />
              <rect x="43" y="60" width="45" height="2" fill="#e27d55" />
              <path d="M15 78 C20 74, 30 76, 32 82 C28 86, 18 84, 15 78 Z" fill="#2E7D32" opacity="0.8" />
              <path d="M22 72 C25 68, 33 69, 34 74 C30 78, 24 76, 22 72 Z" fill="#1b5e20" opacity="0.7" />
              <path d="M92 78 C100 65, 105 40, 108 20" stroke="currentColor" class="text-stone-500 dark:text-stone-600" stroke-width="1.5" stroke-linecap="round" />
              <path d="M96 60 C104 56, 114 60, 110 68 C102 68, 98 64, 96 60 Z" fill="#2f6670" opacity="0.65" />
              <path d="M90 48 C82 44, 80 34, 88 32 C94 36, 94 44, 90 48 Z" fill="#265862" opacity="0.7" />
              <path d="M102 38 C110 32, 118 36, 115 44 C107 45, 104 40, 102 38 Z" fill="#2f6670" opacity="0.65" />
              <path d="M107 20 C105 10, 114 8, 116 16 C114 20, 109 22, 107 20 Z" fill="#265862" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
