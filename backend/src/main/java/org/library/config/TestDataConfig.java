package org.library.config;

import lombok.RequiredArgsConstructor;
import org.library.entity.*;
import org.library.enums.Role;
import org.library.repository.*;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class TestDataConfig
{
	private static final String TEST_EMAIL = "test@example.com";
	private static final String TEST_PASSWORD = "test123456";

	private final UserRepository userRepository;
	private final CategoryRepository categoryRepository;
	private final AuthorRepository authorRepository;
	private final BookRepository bookRepository;
	private final BorrowRecordRepository borrowRecordRepository;
	private final PasswordEncoder passwordEncoder;

	@Bean
	public ApplicationRunner testUserSeeder()
	{
		return args -> userRepository.findByEmail(TEST_EMAIL)
				.orElseGet(() -> userRepository.save(User.builder()
						.name("Test User")
						.role(Role.ADMIN)
						.email(TEST_EMAIL)
						.password(passwordEncoder.encode(TEST_PASSWORD))
						.build()));
	}

	@Bean
	public ApplicationRunner categorySeeder()
	{
		return args ->
		{
			List.of(
					"Fiction", "Science Fiction", "Fantasy", "Mystery", "Romance",
					"Thriller", "Science", "History", "Philosophy", "Technology",
					"Biography", "Self-Help", "Poetry", "Horror", "Adventure",
					"Classic Literature", "Psychology", "Business"
			).forEach(name -> categoryRepository.findByName(name)
					.orElseGet(() -> {
						Category c = new Category();
						c.setName(name);
						return categoryRepository.save(c);
					}));
		};
	}

	@Bean
	public ApplicationRunner authorSeeder()
	{
		return args ->
		{
			List.of(
					"George Orwell", "Isaac Asimov", "J.R.R. Tolkien",
					"Agatha Christie", "Jane Austen", "Stephen King",
					"Carl Sagan", "Yuval Noah Harari", "Marcus Aurelius",
					"Robert C. Martin", "Malcolm Gladwell", "Ernest Hemingway",
					"Harper Lee", "Mark Twain", "Virginia Woolf",
					"Charles Dickens", "Fyodor Dostoevsky", "Sun Tzu"
			).forEach(name -> authorRepository.findByName(name)
					.orElseGet(() -> {
						Author a = new Author();
						a.setName(name);
						return authorRepository.save(a);
					}));
		};
	}

	@Bean
	public ApplicationRunner userSeeder()
	{
		return args ->
		{
			List.of(
					new UserData("Alice Johnson", "alice@example.com", Role.USER),
					new UserData("Bob Smith", "bob@example.com", Role.USER),
					new UserData("Carol Williams", "carol@example.com", Role.USER),
					new UserData("David Brown", "david@example.com", Role.USER),
					new UserData("Eva Martinez", "eva@example.com", Role.USER),
					new UserData("Frank Garcia", "frank@example.com", Role.USER),
					new UserData("Grace Lee", "grace@example.com", Role.USER),
					new UserData("Henry Wilson", "henry@example.com", Role.ADMIN),
					new UserData("Ivy Chen", "ivy@example.com", Role.ADMIN),
					new UserData("Jack Thompson", "jack@example.com", Role.ADMIN)
			).forEach(userData -> userRepository.findByEmail(userData.email())
					.orElseGet(() -> userRepository.save(User.builder()
							.name(userData.name())
							.role(userData.role())
							.email(userData.email())
							.password(passwordEncoder.encode(TEST_PASSWORD))
							.build())));
		};
	}

	@Bean
	public ApplicationRunner bookSeeder()
	{
		return args ->
		{
			Map<String, Category> cats = categoryRepository.findAll().stream()
					.collect(Collectors.toMap(Category::getName, Function.identity()));
			Map<String, Author> auths = authorRepository.findAll().stream()
					.collect(Collectors.toMap(Author::getName, Function.identity()));

			if (cats.isEmpty() || auths.isEmpty())
				return;

			seedBook("1984", "A dystopian novel about totalitarianism and surveillance.", 5,
					cats.get("Fiction"), List.of(auths.get("George Orwell")));
			seedBook("Animal Farm", "A satirical allegory of the Russian Revolution.", 4,
					cats.get("Fiction"), List.of(auths.get("George Orwell")));
			seedBook("Foundation", "A epic saga of a galactic empire's fall and renewal.", 3,
					cats.get("Science Fiction"), List.of(auths.get("Isaac Asimov")));
			seedBook("I, Robot", "A collection of robot-themed short stories.", 3,
					cats.get("Science Fiction"), List.of(auths.get("Isaac Asimov")));
			seedBook("The Hobbit", "A fantasy novel about a hobbit's unexpected journey.", 6,
					cats.get("Fantasy"), List.of(auths.get("J.R.R. Tolkien")));
			seedBook("The Lord of the Rings", "An epic high-fantasy novel.", 4,
					cats.get("Fantasy"), List.of(auths.get("J.R.R. Tolkien")));
			seedBook("Murder on the Orient Express", "A detective novel featuring Hercule Poirot.", 3,
					cats.get("Mystery"), List.of(auths.get("Agatha Christie")));
			seedBook("The ABC Murders", "A serial killer mystery with an ingenious pattern.", 3,
					cats.get("Mystery"), List.of(auths.get("Agatha Christie")));
			seedBook("Pride and Prejudice", "A romantic novel of manners.", 5,
					cats.get("Romance"), List.of(auths.get("Jane Austen")));
			seedBook("Sense and Sensibility", "A novel about love and marriage.", 4,
					cats.get("Romance"), List.of(auths.get("Jane Austen")));
			seedBook("The Shining", "A horror novel about a haunted hotel.", 3,
					cats.get("Horror"), List.of(auths.get("Stephen King")));
			seedBook("It", "A horror novel about an evil entity.", 3,
					cats.get("Horror"), List.of(auths.get("Stephen King")));
			seedBook("Cosmos", "A journey through the universe and scientific discovery.", 4,
					cats.get("Science"), List.of(auths.get("Carl Sagan")));
			seedBook("Sapiens: A Brief History of Humankind", "The story of human civilization.", 5,
					cats.get("History"), List.of(auths.get("Yuval Noah Harari")));
			seedBook("Meditations", "Personal writings of the Roman Emperor.", 4,
					cats.get("Philosophy"), List.of(auths.get("Marcus Aurelius")));
			seedBook("Clean Code", "A handbook of agile software craftsmanship.", 6,
					cats.get("Technology"), List.of(auths.get("Robert C. Martin")));
			seedBook("The Tipping Point", "How small actions create massive change.", 4,
					cats.get("Psychology"), List.of(auths.get("Malcolm Gladwell")));
			seedBook("Outliers", "The story of success and what makes high achievers different.", 4,
					cats.get("Psychology"), List.of(auths.get("Malcolm Gladwell")));
			seedBook("The Old Man and the Sea", "A story of an aging fisherman's struggle.", 3,
					cats.get("Classic Literature"), List.of(auths.get("Ernest Hemingway")));
			seedBook("To Kill a Mockingbird", "A novel about racial injustice in the American South.", 5,
					cats.get("Fiction"), List.of(auths.get("Harper Lee")));
			seedBook("Adventures of Huckleberry Finn", "A novel about a boy's journey down the Mississippi.", 4,
					cats.get("Adventure"), List.of(auths.get("Mark Twain")));
			seedBook("Mrs Dalloway", "A novel depicting a day in the life of Clarissa Dalloway.", 3,
					cats.get("Classic Literature"), List.of(auths.get("Virginia Woolf")));
			seedBook("A Tale of Two Cities", "A novel set during the French Revolution.", 4,
					cats.get("Classic Literature"), List.of(auths.get("Charles Dickens")));
			seedBook("Crime and Punishment", "A psychological drama about guilt and redemption.", 4,
					cats.get("Classic Literature"), List.of(auths.get("Fyodor Dostoevsky")));
			seedBook("The Art of War", "An ancient Chinese military treatise.", 5,
					cats.get("Philosophy"), List.of(auths.get("Sun Tzu")));
			seedBook("Thinking, Fast and Slow", "A groundbreaking tour of the mind.", 4,
					cats.get("Psychology"), List.of(auths.get("Malcolm Gladwell")));
			seedBook("The Pragmatic Programmer", "Your journey to mastery.", 4,
					cats.get("Technology"), List.of(auths.get("Robert C. Martin")));
			seedBook("A Brief History of Time", "A landmark volume in science writing.", 4,
					cats.get("Science"), List.of(auths.get("Carl Sagan")));
			seedBook("The 7 Habits of Highly Effective People", "A personal development classic.", 5,
					cats.get("Self-Help"), List.of(auths.get("Marcus Aurelius")));
			seedBook("The 33 Strategies of War", "A guide to strategic thinking.", 4,
					cats.get("Business"), List.of(auths.get("Sun Tzu")));
		};
	}

	private void seedBook(String title, String description, long availableCopies, Category category, List<Author> authors)
	{
		bookRepository.findByTitle(title)
				.orElseGet(() -> bookRepository.save(Book.builder()
						.title(title)
						.description(description)
						.availableCopies(availableCopies)
						.category(category)
						.authors(authors)
						.build()));
	}

	@Bean
	public ApplicationRunner borrowRecordSeeder()
	{
		return args ->
		{
			Optional<User> optTestUser = userRepository.findByEmail(TEST_EMAIL);
			Optional<User> optAlice = userRepository.findByEmail("alice@example.com");
			Optional<User> optBob = userRepository.findByEmail("bob@example.com");
			Optional<User> optCarol = userRepository.findByEmail("carol@example.com");
			Optional<User> optDavid = userRepository.findByEmail("david@example.com");
			Optional<User> optEva = userRepository.findByEmail("eva@example.com");

			if (optTestUser.isEmpty() || optAlice.isEmpty() || optBob.isEmpty()
					|| optCarol.isEmpty() || optDavid.isEmpty() || optEva.isEmpty())
				return;

			User testUser = optTestUser.get();
			User alice = optAlice.get();
			User bob = optBob.get();
			User carol = optCarol.get();
			User david = optDavid.get();
			User eva = optEva.get();

			Map<String, Book> books = bookRepository.findAll().stream()
					.collect(Collectors.toMap(Book::getTitle, Function.identity()));

			if (books.isEmpty())
				return;

			LocalDate today = LocalDate.now();

			seedBorrowRecord(testUser, books.get("1984"), today.minusDays(14), today.minusDays(7), today.minusDays(5));
			seedBorrowRecord(testUser, books.get("Clean Code"), today.minusDays(10), today.plusDays(4), null);
			seedBorrowRecord(alice, books.get("1984"), today.minusDays(12), today.minusDays(5), today.minusDays(3));
			seedBorrowRecord(alice, books.get("The Hobbit"), today.minusDays(8), today.plusDays(6), null);
			seedBorrowRecord(alice, books.get("Sapiens: A Brief History of Humankind"), today.minusDays(3), today.minusDays(1), null);
			seedBorrowRecord(bob, books.get("Pride and Prejudice"), today.minusDays(20), today.minusDays(13), today.minusDays(12));
			seedBorrowRecord(bob, books.get("Foundation"), today.minusDays(7), today.plusDays(7), null);
			seedBorrowRecord(bob, books.get("Clean Code"), today.minusDays(5), today.minusDays(2), null);
			seedBorrowRecord(carol, books.get("The Shining"), today.minusDays(15), today.minusDays(8), today.minusDays(7));
			seedBorrowRecord(carol, books.get("Cosmos"), today.minusDays(6), today.minusDays(1), null);
			seedBorrowRecord(carol, books.get("The Hobbit"), today.minusDays(2), today.plusDays(12), null);
			seedBorrowRecord(david, books.get("Sapiens: A Brief History of Humankind"), today.minusDays(18), today.minusDays(11), today.minusDays(10));
			seedBorrowRecord(david, books.get("1984"), today.minusDays(9), today.minusDays(2), null);
			seedBorrowRecord(eva, books.get("Pride and Prejudice"), today.minusDays(25), today.minusDays(18), today.minusDays(17));
			seedBorrowRecord(eva, books.get("Foundation"), today.minusDays(4), today.minusDays(2), null);
			seedBorrowRecord(eva, books.get("Clean Code"), today.minusDays(1), today.plusDays(13), null);
			seedBorrowRecord(testUser, books.get("Sapiens: A Brief History of Humankind"), today.minusDays(22), today.minusDays(15), today.minusDays(14));
			seedBorrowRecord(alice, books.get("Cosmos"), today.minusDays(16), today.minusDays(9), today.minusDays(8));
		};
	}

	private void seedBorrowRecord(User user, Book book, LocalDate borrowDate, LocalDate dueDate, LocalDate returnDate)
	{
		if (book == null)
			return;

		borrowRecordRepository.findByUserAndBookAndBorrowDate(user, book, borrowDate)
				.orElseGet(() -> borrowRecordRepository.save(BorrowRecord.builder()
						.user(user)
						.book(book)
						.borrowDate(borrowDate)
						.dueDate(dueDate)
						.returnDate(returnDate)
						.build()));
	}

	private record UserData(String name, String email, Role role) {}
}
