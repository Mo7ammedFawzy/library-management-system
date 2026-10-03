<script setup lang="ts">
defineProps<{
  totalTitles: number
  totalCopies: number
  shelfCount: number
  lowStockCount: number
  collectionHealth: number
}>()

const emit = defineEmits<{
  add: []
}>()
</script>

<template>
  <section
    class="books-hero"
    aria-labelledby="books-heading"
  >
    <div class="books-hero__main">
      <div class="books-hero__copy">
        <p class="books-hero__eyebrow">
          <UIcon
            name="i-lucide-library-big"
            class="size-3.5 text-[#f4c762]"
            aria-hidden="true"
          />
          Athenaeum catalogue
        </p>
        <h1
          id="books-heading"
          class="books-hero__title"
        >
          The collection, in order.
        </h1>
        <p class="books-hero__description">
          Search every title and keep every copy ready.
        </p>
        <UButton
          icon="i-lucide-plus"
          aria-label="Add book"
          class="books-hero__action !min-h-9 !rounded-[9px] !px-4 !font-bold"
          @click="emit('add')"
        >
          Add a title
        </UButton>
      </div>

      <div
        class="books-hero__collection"
        role="group"
        aria-label="Collection health"
      >
        <div
          class="books-hero__book-stack"
          aria-hidden="true"
        >
          <span class="books-hero__book books-hero__book--one">IDEAS</span>
          <span class="books-hero__book books-hero__book--two">STORIES</span>
          <span class="books-hero__book books-hero__book--three">SCIENCE</span>
        </div>
        <div class="books-hero__health">
          <p>Collection health</p>
          <strong>{{ collectionHealth }}%</strong>
          <span>
            {{ lowStockCount ? `${lowStockCount} ${lowStockCount === 1 ? 'title needs' : 'titles need'} restocking` : 'All titles are well stocked' }}
          </span>
        </div>
      </div>
    </div>

    <dl class="books-hero__stats">
      <div>
        <dt>Titles</dt>
        <dd>{{ totalTitles }}</dd>
      </div>
      <div>
        <dt>Copies available</dt>
        <dd>{{ totalCopies }}</dd>
      </div>
      <div>
        <dt>Shelves</dt>
        <dd>{{ shelfCount }}</dd>
      </div>
      <div>
        <dt>Low stock</dt>
        <dd>{{ lowStockCount }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.books-hero {
  --books-gold: #e4ae35;
  position: relative;
  isolation: isolate;
  flex: none;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  background: #102f49;
  color: #f8fafc;
  box-shadow: 0 10px 28px rgba(15, 42, 65, 0.11);
}

.books-hero::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background:
    linear-gradient(105deg, transparent 48%, rgba(255, 255, 255, 0.035) 48%, rgba(255, 255, 255, 0.035) 49%, transparent 49%),
    repeating-linear-gradient(90deg, transparent 0, transparent 72px, rgba(255, 255, 255, 0.035) 73px, transparent 74px);
  content: '';
  mask-image: linear-gradient(90deg, transparent, #000 45%, #000);
}

.books-hero::after {
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background: var(--books-gold);
  content: '';
}

.books-hero__main {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(17rem, 0.55fr);
  gap: 1.25rem;
  padding: 1rem 1.5rem 0.75rem;
}

.books-hero__copy {
  min-width: 0;
  align-self: center;
}

.books-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #b8c8d6;
  font-size: 0.6875rem;
  font-weight: 650;
}

.books-hero__title {
  margin-top: 0.35rem;
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 2.5vw, 2.3rem);
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1.04;
}

.books-hero__description {
  max-width: 35rem;
  margin-top: 0.3rem;
  color: #c6d3df;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.books-hero__action {
  margin-top: 0.5rem;
  background: var(--books-gold) !important;
  color: #102f49 !important;
  box-shadow: 0 8px 22px rgba(4, 19, 32, 0.18) !important;
  transition: background-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.books-hero__action:hover {
  background: #f4c762 !important;
  box-shadow: 0 10px 26px rgba(4, 19, 32, 0.24) !important;
  transform: translateY(-1px);
}

.books-hero__action:active {
  transform: translateY(1px);
}

.books-hero__collection {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  padding-left: 1rem;
}

.books-hero__book-stack {
  position: relative;
  width: 8.5rem;
  height: 5.5rem;
  flex: 0 0 auto;
}

.books-hero__book {
  position: absolute;
  display: flex;
  width: 2.65rem;
  height: 4.65rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem 0.45rem 0.45rem 0.25rem;
  box-shadow: 0 18px 26px rgba(4, 19, 32, 0.28);
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  writing-mode: vertical-rl;
}

.books-hero__book::before {
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 0.3rem;
  width: 1px;
  background: currentColor;
  content: '';
  opacity: 0.28;
}

.books-hero__book--one {
  top: 0.65rem;
  left: 0.25rem;
  background: #d8a536;
  color: #17334b;
  transform: rotate(-8deg);
}

.books-hero__book--two {
  z-index: 2;
  top: 0.05rem;
  left: 2.7rem;
  background: #e7edf2;
  color: #17334b;
}

.books-hero__book--three {
  top: 0.7rem;
  left: 5.2rem;
  background: #356b83;
  color: #f4f7fa;
  transform: rotate(8deg);
}

.books-hero__health {
  min-width: 7rem;
}

.books-hero__health p {
  color: #aebfce;
  font-size: 0.625rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.books-hero__health strong {
  display: block;
  margin-top: 0.2rem;
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 650;
  letter-spacing: -0.05em;
  line-height: 1;
}

.books-hero__health span {
  display: block;
  margin-top: 0.2rem;
  color: #b9c8d5;
  font-size: 0.625rem;
  line-height: 1.45;
}

.books-hero__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(5, 24, 40, 0.24);
}

.books-hero__stats > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.35rem 0.9rem;
}

.books-hero__stats > div:last-child {
  border-right: 0;
}

.books-hero__stats dt {
  color: #aebfce;
  font-size: 0.625rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.books-hero__stats dd {
  color: #f8fafc;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.035em;
}

@media (max-width: 1023px) {
  .books-hero__main {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .books-hero__collection {
    display: none;
  }
}

@media (max-width: 767px) {
  .books-hero {
    border-radius: 0.8rem;
  }

  .books-hero__main {
    padding: 0.875rem 1rem 0.75rem;
  }

  .books-hero__title {
    margin-top: 0.25rem;
    font-size: clamp(1.6rem, 8vw, 2rem);
  }

  .books-hero__description {
    margin-top: 0.25rem;
    font-size: 0.75rem;
  }

  .books-hero__action {
    margin-top: 0.4rem;
  }

  .books-hero__stats {
    display: none;
  }
}

@media (max-height: 780px) and (min-width: 1024px) {
  .books-hero__main {
    grid-template-columns: 1fr;
  }

  .books-hero__collection,
  .books-hero__description {
    display: none;
  }

  .books-hero__stats > div {
    padding-block: 0.25rem;
  }
}

@media (max-width: 420px) {
  .books-hero__eyebrow {
    font-size: 0.625rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .books-hero__action {
    transition: none;
  }
}
</style>