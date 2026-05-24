import type { Movie, Cinema, Show, SeatLayout, FnBItem, City, Booking, PromoCode, User } from '@/types'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Cities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export const cities: City[] = [
  { id: 'blr', name: 'Bengaluru', state: 'Karnataka', popular: true },
  { id: 'hyd', name: 'Hyderabad', state: 'Telangana', popular: true },
  { id: 'chn', name: 'Chennai', state: 'Tamil Nadu', popular: true },
  { id: 'cbe', name: 'Coimbatore', state: 'Tamil Nadu', popular: true },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Movies
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export const movies: Movie[] = [
  // ─── NOW SHOWING ─────────────────────────────────────────────────────────────

  {
    id: 'mov-1',
    title: 'Karuppu',
    tagline: 'Justice wears black.',
    synopsis:
      'When justice falters, the guardian deity Lord Karuppasamy disguises himself as a lawyer to fight a corrupt court system exploiting a young girl awaiting a life-saving liver transplant. Suriya plays a righteous advocate possessed by the divine spirit of the folk deity, taking on powerful enemies in a gripping courtroom-meets-folklore action drama.',
    posterUrl: 'https://cdn.district.in/movies-assets/images/cinema/Karuppu-1d0a67f0-4854-11f1-aa5f-7174a7d9c3c2.jpg?im=Resize,width=400',
    backdropUrl: 'https://image.tmdb.org/t/p/original/karuppu_backdrop.jpg',
    trailerUrl: 'https://youtu.be/JpVl_-1YgIo?si=VxmHArlyZBNIrKjl',
    genres: ['Action', 'Drama', 'Fantasy'],
    language: 'Tamil',
    languages: ['Tamil', 'Telugu', 'Hindi', 'Malayalam'],
    formats: ['2D', 'IMAX', '4DX'],
    duration: 150,
    releaseDate: '2026-05-14',
    rating: { imdb: 8.2, rottenTomatoes: 88, userRating: 8.6 },
    certification: 'UA',
    cast: [
      { name: 'Suriya', role: 'Karuppasamy / Lawyer', imageUrl: 'https://cdn.district.in/movies-assets/images/cinema/Suriua-590f7ac0-de75-11ed-bea3-ef4efacaa437.jpg?im=Resize,width=184' },
      { name: 'Trisha Krishnan', role: 'Lead Female', imageUrl: 'https://cdn.district.in/movies-assets/images/cinema/trisha-15191e80-e414-11ed-8b83-8735af6d695b.jpg?im=Resize,width=184' },
      { name: 'RJ Balaji', role: 'Supporting', imageUrl: 'https://cdn.district.in/movies-assets/images/cinema/RjBalaji_kuebkw-c50d7970-aaf8-11ee-b2b0-6b4432b0a5cd.jpg?im=Resize,width=184' },
    ],
    director: 'RJ Balaji',
    priceFrom: 180,
    status: 'now_showing',
  },

  {
    id: 'mov-2',
    title: 'Kara',
    tagline: 'Sixteen days. One man. No way out.',
    synopsis:
      'Set in Ramanathapuram in 1991, against the backdrop of the Gulf War, Karasaami — a man who walked away from his past — is forced to revisit the life he left behind. Over the course of 16 harrowing days, he must protect those who depend on him while confronting the consequences of his choices. A gripping heist action thriller blending raw emotion with high-stakes suspense.',
    posterUrl: 'https://images.filmibeat.com/ph-big/2026/04/kara1777291105_0.jpeg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/kara_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=mEtGQOTrsU4',
    genres: ['Action', 'Crime', 'Thriller'],
    language: 'Tamil',
    languages: ['Tamil', 'Telugu', 'Hindi'],
    formats: ['2D', 'IMAX'],
    duration: 161,
    releaseDate: '2026-04-30',
    rating: { imdb: 7.4, rottenTomatoes: 65, userRating: 7.8 },
    certification: 'UA',
    cast: [
      { name: 'Dhanush', role: 'Karasaami / Kara', imageUrl: 'https://cdn.district.in/movies-assets/images/cinema/dhan-0f1f9060-425b-11f1-80ff-6fb364bcd887.jpg?im=Resize,width=184' },
      { name: 'Mamitha Baiju', role: 'Lead Female', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/mamitha-baiju-1092540-1702560394.jpg' },
      { name: 'Jayaram', role: 'Supporting', imageUrl: 'https://cdn.district.in/movies-assets/images/cinema/Jayaram-e2687830-ccbc-11ef-a9e2-63c420e5944f.jpg?im=Resize,width=184' },
    ],
    director: 'Vignesh Raja',
    priceFrom: 200,
    status: 'now_showing',
  },

  {
    id: 'mov-3',
    title: 'LIK: Love Insurance Kompany',
    tagline: 'In 2040, love has a risk rating.',
    synopsis:
      'Set in the year 2040, a futuristic app predicts heartbreak and controls relationships through calculated risk. A man who believes in old-school, organic love challenges the tech-driven system after falling for a woman who trusts algorithms over instinct. A charming sci-fi romantic comedy that asks: can true love survive in a world run by data?',
    posterUrl: 'https://www.myvue.com/-/media/vuecinemas/film-and-events/nov-2025/likposter_712px.jpg?rev=c9b145a0f1eb40f6895e2ead633e36bd',
    backdropUrl: 'https://image.tmdb.org/t/p/original/lik_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=wMiCXl8ZybQ',
    genres: ['Romance', 'Comedy', 'Sci-Fi'],
    language: 'Tamil',
    languages: ['Tamil', 'Telugu'],
    formats: ['2D'],
    duration: 150,
    releaseDate: '2026-04-10',
    rating: { imdb: 7.1, rottenTomatoes: 70, userRating: 7.5 },
    certification: 'UA',
    cast: [
      { name: 'Pradeep Ranganathan', role: 'Lead Male', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbYW2nzCLepQFtwZwhAwFQ8alOsOJ9IlwSbrfqEy-fyXSsWH_wYubIOXi4Z9cdgnEnDNuCU2dpr88EMZbtRNz8WwdiMNTuZTz3W7OGOHi1Og&s=10' },
      { name: 'Krithi Shetty', role: 'Lead Female', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZcuoOv5Hzvur0A5dC9BdhRhNKB1hBqvbUPazvU8Ep-SHllnH8uFWHxpTHPry8JTlf-i09f9l_SUv7B_4qVsJ5rws1SLINjK0gh2zZM2vR&s=10' },
      { name: 'S.J. Suryah', role: 'Supporting', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKCAAU5PNPCeBmX8sNEG01ZJVM9TrTYyZv2RUH7sgfsooFlOuw9bxa4Mdb2gfGZaEKW_bA7c2ng5aDilZMEXwnX-QSCQWpnothw02xqz7LGw&s=10' },
    ],
    director: 'Vignesh Shivan',
    priceFrom: 150,
    status: 'now_showing',
  },

  {
    id: 'mov-4',
    title: 'Project Hail Mary',
    tagline: '11.9 light-years from home. 1 chance to save us all.',
    synopsis:
      'Science teacher Ryland Grace wakes up alone on a spaceship light years from Earth, with no memory of who he is or how he got there. As his memories slowly return, he uncovers his mission: solve the mystery of the strange organism causing the Sun to die and find a way to save humanity. An unexpected friendship with an alien life form may be his only hope.',
    posterUrl: 'https://cdn.district.in/movies-assets/images/cinema/G%20Project-Hail-Mary-b79dfed0-5651-11f0-b09a-11c880b90aa7.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/project_hail_mary_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=m08TxIsFTRI',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    formats: ['2D', 'IMAX', '4DX'],
    duration: 156,
    releaseDate: '2026-03-20',
    rating: { imdb: 8.6, rottenTomatoes: 94, userRating: 9.0 },
    certification: 'PG-13',
    cast: [
      { name: 'Ryan Gosling', role: 'Ryland Grace', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQ42xwoCD3fr6cjzG0UCJWiWGV0SliujHnHmnfXF23Jfjr6ODOAXASg_OCsYjVlqteWx_r7NK3PZWKLt5gMiGgWVIx42u44NlVlvYyMRex80NdzFi_xUg8JFihpqlPBxmQGGXGbd4RFH1t4&s=19' },
      { name: 'Sandra Hüller', role: 'Eva Stratt', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSwzkvK8ziDqAhISEdsw8qOj4Q5OfsWP2ttpyj1FZo6TgxzWrdveye9yMb3au7su6VoppOTQZQQbSFv8YDEZqBpWsMB3vgNZH36x6XMTInClBdMUTxDOBrgo0T6wNHv2XBYppBIwTMdb0A&s=19' },
      { name: 'Lionel Boyce', role: 'Carl', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSK2_Zdmt6u8OQXzwGnb0xtJ9iGiCST9RN59rQdEAArTvLaxWXK_Bho7YXPt4hJDJb3bprO7UzRnxMnHqES6sD3WwCBxIpMbW6bvtLDNMBvjhkt7MfTQYKWuqL7XsRhwGVcAFjgS1Swx3Ij&s=19' },
    ],
    director: 'Phil Lord & Christopher Miller',
    priceFrom: 300,
    status: 'now_showing',
  },

  {
    id: 'mov-5',
    title: 'Michael',
    tagline: 'The King. The Man. The Legend.',
    synopsis:
      'The extraordinary life of Michael Jackson — the most influential entertainer in history — told from his rise as a child prodigy in The Jackson 5 to his reign as the undisputed King of Pop. Directed by Antoine Fuqua, this biopic explores the man behind the music, his triumphs, controversies, and the enduring legacy that defined generations.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/3/37/Michael_%282026_film_poster%29.png',
    backdropUrl: 'https://image.tmdb.org/t/p/original/michael_jackson_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=3zOLzsbOleM',
    genres: ['Biography', 'Drama', 'Music'],
    language: 'English',
    languages: ['English', 'Hindi', 'Tamil'],
    formats: ['2D', 'IMAX'],
    duration: 130,
    releaseDate: '2026-04-18',
    rating: { imdb: 7.5, rottenTomatoes: 0, userRating: 8.2 },
    certification: 'PG-13',
    cast: [
      { name: 'Jaafar Jackson', role: 'Michael Jackson', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSG7Kilyjv3xvhulRR1nPph29UocmGGzCNlljiouwzAUb6E1TP7VInMoJvD3JDfjVNiA-RJAOkx7_TPv5ZK9KiOkqIQfbJ2ejSJQyyGEP46kFSqGY5192jr27ELjiqoMdMdOaxSVs8wHbU&s=19' },
      { name: 'Colman Domingo', role: 'Joe Jackson', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRctKP-HmjcWg2lterm490G8wlNB90HRsYMWJqLGZaZVmqjFYd7daao-8BZRxck5aNCiFOBIAuTAOpf5w70f4re-RoDZQC2D4DKOtg3KysGOdh8tbQNpmFp9vQGq4f8j3jQjuKOIHfvFvS5&s=19' },
      { name: 'Nia Long', role: 'Katherine Jackson', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThwVo4ZRGYU-yOKKEU4DhhRXRIYECoYjqF9DF2Yzm2KMNt068m4HegTJoMeSh4lTdCzgqWcHF9__dm3EiJEJ1Ih3jZzarLk4uzyUyJZiVN&s=10' },
    ],
    director: 'Antoine Fuqua',
    priceFrom: 250,
    status: 'now_showing',
  },

{
    id: 'mov-6',
    title: 'Toxic: A Fairy Tale for Grown-Ups',
    tagline: 'A Fairy Tale for Grown Ups.',
    synopsis:
      'Set in a bygone era along the coast of Goa, a powerful drug cartel operates behind the facade of sunlit beaches and lively culture. Beneath the paradise lies a shadow network that controls the region through fear and manipulation, triggering a gritty war for power and morality.',
    posterUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgCbbdzWINTC3JlKDVoKeOr1-ajHXhsvycPICl979yDNho5Xi6TI4FhC7fqmyfvKvKNTi4G88C8XsW4VLHePBnNrvg958t4L4DNDuUCPvDVcjXS4_FTZ59AaUBqwbaqbyiWhzaJuG60zQxOosk6wsy8sgufn3BA2jc5xjFW01Dj6cxbeycS6rJ8Sz96bsE/s1500/Toxic001.jpg',
    backdropUrl: 'https://tmdb.org',
    trailerUrl: 'https://www.youtube.com/watch?v=aF08WVSvCok',
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    language: 'Kannada',
    languages: ['Kannada', 'English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'],
    formats: ['2D', 'IMAX'],
    duration: 195,
    releaseDate: '2026-06-04',
    rating: { imdb: 7.8, rottenTomatoes: 82, userRating: 8.5 },
    certification: 'UA',
    cast: [
      { name: 'Yash', role: 'Raya', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSraZehO_0R_I0b9tJrdyyoV3kcE8SME-Bxvw&s' },
      { name: 'Kiara Advani', role: 'Nadia', imageUrl: 'https://knowlepedia.org/images/d/dc/Kiara_Advani.jpg' },
      { name: 'Huma Qureshi', role: 'Elizabeth (Antagonist)', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Huma_Qureshi_at_TIFF_2025_02.jpg/960px-Huma_Qureshi_at_TIFF_2025_02.jpg' },
      { name: 'Nayanthara', role: 'Ganga', imageUrl: 'https://femina.wwmindia.com/content/2023/aug/nayanthara-thumb1693464257.jpg' },
    ],
    director: 'Geetu Mohandas',
    priceFrom: 200,
    status: 'now_showing',
},
  {
    id: 'mov-7',
    title: 'Drishyam 3',
    tagline: 'The secret buried. The truth rising.',
    synopsis:
      'The third and final chapter of Malayalam cinema\'s most iconic crime thriller franchise. Georgekutty and his family face an organized new threat as cracks begin to form in the carefully constructed web of deception. With walls closing in and past secrets resurfacing, how much more is he willing to sacrifice to protect those he loves? Mohanlal delivers a masterclass as the franchise reaches its breathtaking conclusion.',
    posterUrl: 'https://cdn.district.in/movies-assets/images/cinema/Drishyam-3_Poster-0d2290e0-4469-11f1-9e72-b3859bd2479f%20(1)-6495a2d0-5360-11f1-8c65-299184906c19.jpg?im=Resize,width=400',
    backdropUrl: 'https://image.tmdb.org/t/p/original/drishyam3_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=TX8xH5gPHdY',
    genres: ['Crime', 'Thriller', 'Drama'],
    language: 'Malayalam',
    languages: ['Malayalam', 'Tamil', 'Telugu', 'Hindi'],
    formats: ['2D', 'IMAX'],
    duration: 159,
    releaseDate: '2026-05-21',
    rating: { imdb: 8.4, rottenTomatoes: 90, userRating: 8.8 },
    certification: 'UA',
    cast: [
      { name: 'Mohanlal', role: 'Georgekutty', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhnsEqHH-w3OnK-20Up0aO6ohnoqWIV-RPJA&s' },
      { name: 'Meena', role: 'Rani', imageUrl: 'https://singavarapu.wordpress.com/wp-content/uploads/2011/03/meena2.jpg?w=584' },
      { name: 'Asha Sharath', role: 'SP Geethanjali', imageUrl: 'https://pbs.twimg.com/media/EtdZSjUVEAEqPjU.jpg' },
    ],
    director: 'Jeethu Joseph',
    priceFrom: 200,
    status: 'now_showing',
  },

  {
    id: 'mov-8',
    title: 'Athiradi',
    tagline: 'Campus chaos. Epic friendships. One wild ride.',
    synopsis:
      'Samkutty is an enthusiastic and overzealous college student who falls in love with his classmate. Over time, he gains popularity among his peers and decides to revive a long-forgotten college tradition, setting off a chain reaction of chaos, comedy, and unexpected consequences. Starring the beloved trio of Basil Joseph, Tovino Thomas, and Vineeth Sreenivasan, Athiradi is a wholesome campus entertainer packed with heart and humour.',
    posterUrl: 'https://cdn.district.in/movies-assets/images/cinema/Athiradi_Gallery-371cf200-36f4-11f1-ad5d-df8c1aec5c9a.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/athiradi_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=NFZmwmAZqXE',
    genres: ['Drama', 'Comedy', 'Action'],
    language: 'Malayalam',
    languages: ['Malayalam', 'Tamil'],
    formats: ['2D'],
    duration: 138,
    releaseDate: '2026-05-14',
    rating: { imdb: 7.6, rottenTomatoes: 78, userRating: 8.0 },
    certification: 'U',
    cast: [
      { name: 'Basil Joseph', role: 'Samkutty', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx-y6QMLl6i-ffzF3Rt4WAqbI2pmzWv8f8ow&s' },
      { name: 'Tovino Thomas', role: 'Lead', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk6CYoonryhHlLeTo8ecZH-8gxLxnKqtNrHg&s' },
      { name: 'Riya Shibu', role: 'Supporting', imageUrl: 'https://gallery.123telugu.com/content/slideshows/2025/12/Riya-Shibu28/images/Riya%20Shibu%20(1).jpg' },
    ],
    director: 'Arun Anirudhan',
    priceFrom: 150,
    status: 'now_showing',
  },

{
  id: 'mov-20',
  title: 'Spider-Man: Brand New Day',
  tagline: 'Every hero deserves a second chance.',
  synopsis:
    'After the world forgets Peter Parker, Spider-Man must rebuild his life from scratch while facing a dangerous new threat rising in New York City. Torn between loneliness, responsibility, and destiny, Peter discovers that being a hero comes at a cost greater than ever before. Spider-Man: Brand New Day delivers emotional storytelling, breathtaking action, and a fresh new chapter for Marvel’s iconic web-slinger.',
  posterUrl: 'https://cdn.marvel.com/content/2x/smbnd_online_1400x2100_hoodie_02.jpg',
  backdropUrl: 'https://images.unsplash.com/photo-1635865165118-917ed9e20936?q=80&w=1600&auto=format&fit=crop',
  trailerUrl: 'https://www.youtube.com/watch?v=8TZMtslA3UY',
  genres: ['Action', 'Adventure', 'Sci-Fi'],
  language: 'English',
  languages: ['English', 'Tamil', 'Telugu', 'Hindi', 'Malayalam'],
  formats: ['2D', '3D', 'IMAX', '4DX'],
  duration: 165,
  releaseDate: '2026-07-31',
  rating: { imdb: 0, rottenTomatoes: 0, userRating: 0 },
  certification: 'UA13+',
  cast: [
    {
      name: 'Tom Holland',
      role: 'Peter Parker / Spider-Man',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKT1_oWMU2qS4mjB-wNqll7d9X67UVvxn8VEGvApavkSj-bsXkWYpEs9B06tluPiz78X5P7HsOXsL2pmmsJfhK5fsip9UPwK6sjAclCcrN&s=10',
    },
    {
      name: 'Zendaya',
      role: 'MJ',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSr3rs8za-xOAkEpUppQVlB7nT6ZXVrEzcrnd2P97U6z62pLU-gb7J0GrvmEMNcfI-RkqoT-erc10YJJbFiB9aZcQ9DzrSR03qFOsMH3Y83g&s=10',
    },
    {
      name: 'Jacob Batalon',
      role: 'Ned Leeds',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcT2-aN-qBzrcb48oxDwdgCuj3hVzm5_68yMNDsKHv6QVWUJwXmQm6l-2INMEzH6EhV3Esf_7bWn4CsIB4TLraqV8Qv2604w9MGhHuKc2uhzz6PTRuk22JxGB4ceaNTWQ8sRUv7vsEmM-hQ&s=19',
    },
  ],
  director: 'Destin Daniel Cretton',
  priceFrom: 350,
  status: 'coming_soon',
},

  // ─── COMING SOON ─────────────────────────────────────────────────────────────

  {
    id: 'mov-10',
    title: 'Jana Nayagan',
    tagline: 'A clash of ideologies. Only one can lead.',
    synopsis:
      'Two ideological opposites — one a voice of the people, the other a force of control — collide when a child\'s silent fear reignites old wounds. A former police officer is pulled into a battle far greater than personal revenge, navigating corruption, power, and political conspiracy. Thalapathy Vijay\'s final cinematic chapter before he devotes himself fully to governance as Tamil Nadu\'s Chief Minister.',
    posterUrl: 'https://cdn.district.in/movies-assets/images/cinema/Jana-Nayagan_Poster-ba859210-ea04-11f0-b4ba-9ba258b05cd6.jpg?im=Resize,width=400',
    backdropUrl: 'https://image.tmdb.org/t/p/original/jana_nayagan_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=fJaAYcERf3Y',
    genres: ['Action', 'Thriller', 'Drama'],
    language: 'Tamil',
    languages: ['Tamil', 'Telugu', 'Hindi', 'Malayalam'],
    formats: ['2D', 'IMAX', '4DX'],
    duration: 165,
    releaseDate: '2026-06-22',
    rating: { imdb: 0, rottenTomatoes: 0, userRating: 0 },
    certification: 'UA',
    cast: [
      { name: 'Vijay', role: 'Lead Role', imageUrl: 'https://image.tmdb.org/t/p/w200/vijay.jpg' },
      { name: 'Pooja Hegde', role: 'Lead Female', imageUrl: 'https://image.tmdb.org/t/p/w200/poojahegde.jpg' },
      { name: 'Bobby Deol', role: 'Antagonist', imageUrl: 'https://image.tmdb.org/t/p/w200/bobbydeol.jpg' },
    ],
    director: 'H. Vinoth',
    priceFrom: 250,
    status: 'coming_soon',
  },

  {
    id: 'mov-11',
    title: 'Jailer 2',
    tagline: 'Tiger is back. And this time, he brought everyone.',
    synopsis:
      'Muthuvel Pandian, the legendary retired jailer, returns for his most explosive mission yet. Faced with a new threat that spans borders and criminal empires, Tiger assembles an unlikely alliance of allies and adversaries. Rajinikanth leads a galaxy-sized ensemble in this high-octane action comedy sequel that promises even bigger scale, wilder stunts, and pure Thalaivar magic.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDI2NmU4YTMtNGQ4ZC00NjlkLWI2NzctMDc5OWI5ODdmMWU5XkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/jailer2_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=aaNq2NL6D4A',
    genres: ['Action', 'Comedy', 'Crime'],
    language: 'Tamil',
    languages: ['Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada'],
    formats: ['2D', 'IMAX', '4DX'],
    duration: 170,
    releaseDate: '2026-09-11',
    rating: { imdb: 0, rottenTomatoes: 0, userRating: 0 },
    certification: 'UA',
    cast: [
      { name: 'Rajinikanth', role: 'Tiger Muthuvel Pandian', imageUrl: 'https://femina.wwmindia.com/content/2025/nov/rajinikanth--thumb1762323227.jpg' },
      { name: 'Vijay Sethupathi', role: 'Antagonist', imageUrl: 'https://resizing.flixster.com/Ss7uc6D5Gi-025GT0X4PaNXuJdg=/fit-in/352x330/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/680744_v9_aa.jpg' },
      { name: 'Mohanlal', role: 'Mathew', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhnsEqHH-w3OnK-20Up0aO6ohnoqWIV-RPJA&s' },
    ],
    director: 'Nelson Dilipkumar',
    priceFrom: 300,
    status: 'coming_soon',
  },

  {
    id: 'mov-12',
    title: 'Demonte Colony 3',
    tagline: 'The colony remembers.',
    synopsis:
      'The third chapter of Tamil cinema\'s most beloved horror franchise returns to the cursed grounds of Demonte Colony. A new group of unsuspecting visitors disturb the restless spirits that haunt the infamous property, unleashing a terror far darker than anything seen before. Director Ajay Gnanamuthu delivers another masterclass in atmospheric dread and psychological horror.',
    posterUrl: 'https://pbs.twimg.com/media/HE9YkzTaMAA5lPC.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/demonte3_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=sYNj03cBJHU',
    genres: ['Horror', 'Thriller'],
    language: 'Tamil',
    languages: ['Tamil', 'Telugu', 'Malayalam'],
    formats: ['2D'],
    duration: 135,
    releaseDate: '2026-06-05',
    rating: { imdb: 0, rottenTomatoes: 0, userRating: 0 },
    certification: 'UA',
    cast: [
      { name: 'Arulnithi', role: 'Lead', imageUrl: 'https://image.tmdb.org/t/p/w200/arulnithi.jpg' },
      { name: 'Priya Bhavani Shankar', role: 'Lead Female', imageUrl: 'https://image.tmdb.org/t/p/w200/priyabhavanishankar.jpg' },
      { name: 'Ajay Gnanamuthu', role: 'Cameo', imageUrl: 'https://image.tmdb.org/t/p/w200/ajaygnanamuthu.jpg' },
    ],
    director: 'Ajay Gnanamuthu',
    priceFrom: 150,
    status: 'coming_soon',
  },

  {
    id: 'mov-13',
    title: 'Star Wars: The Mandalorian & Grogu',
    tagline: 'The adventure of a lifetime. On the big screen.',
    synopsis:
      'For the first time, the beloved bounty hunter Din Djarin and Grogu — the galaxy\'s most adored duo — make the leap from the acclaimed Disney+ series to the big screen. Their bond is tested in a galaxy-spanning adventure filled with new allies, ancient enemies, and the ever-present call of the Force. The Mandalorian and Grogu unite for their most epic chapter yet.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzVkMmJhNTgtNjYwOS00YjM0LThlNWEtNGExNmIxZjVkMmJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/mandalorian_backdrop.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=uwild1rw7Aw',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    language: 'English',
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    formats: ['2D', 'IMAX', '3D', '4DX'],
    duration: 145,
    releaseDate: '2026-05-22',
    rating: { imdb: 0, rottenTomatoes: 0, userRating: 0 },
    certification: 'PG',
    cast: [
      { name: 'Pedro Pascal', role: 'Din Djarin / The Mandalorian', imageUrl: 'https://image.tmdb.org/t/p/w200/pedropascal.jpg' },
      { name: 'Grogu', role: 'Grogu', imageUrl: 'https://image.tmdb.org/t/p/w200/grogu.jpg' },
      { name: 'Sigourney Weaver', role: 'Supporting', imageUrl: 'https://image.tmdb.org/t/p/w200/sigourney.jpg' },
    ],
    director: 'Jon Favreau',
    priceFrom: 300,
    status: 'coming_soon',
  },

  // ─── TRENDING ────────────────────────────────────────────────────────────────

{
    id: 'mov-14',
    title: 'The Paradise',
    tagline: 'My hero will walk into hell and turn it into The Paradise.',
    synopsis:
      'Set in 1980s Secunderabad, a marginalized tribal community faces harsh discrimination and systemic oppression. Driven to the edge, they wage a fierce battle for their citizenship and basic human rights under the guidance of an unexpected, rugged leader named Dhagad.',
    posterUrl: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC,e-usm-2-2-0.5-0.008/et00436621-ultjcphpnk-portrait.jpg',
    backdropUrl: 'https://tmdb.org',
    trailerUrl: 'https://www.youtube.com/watch?v=r2Yf6LLewuc',
    genres: ['Action', 'Adventure', 'Drama'],
    language: 'Telugu',
    languages: ['Telugu', 'Bengali', 'Hindi', 'English', 'Tamil', 'Spanish', 'Kannada', 'Malayalam'],
    formats: ['2D', 'IMAX'],
    duration: 158,
    releaseDate: '2026-08-21',
    rating: { imdb: 0, rottenTomatoes: 0, userRating: 0 },
    certification: 'UA',
    cast: [
      { name: 'Nani', role: 'Dhagad', imageUrl: 'https://www.deccanchronicle.com/h-upload/2024/09/05/1838459-nani.jpg' },
      { name: 'Kayadu Lohar', role: 'Lead Female', imageUrl: 'https://www.telugu360.com/wp-content/uploads/2025/02/Kayadu-Lohar.jpg' },
    ],
    director: 'Srikanth Odela',
    priceFrom: 220,
    status: 'now_showing',
},

  {
    id: 'mov-15',
    title: 'Pushpa 2: The Rule',
    tagline: 'The fire rises. The rule begins.',
    synopsis:
      'Pushpa Raj continues his ascent in the smuggling world, facing new adversaries and challenges. As his empire grows, so do the threats from powerful enemies who will stop at nothing to bring him down. With Srivalli by his side and Bhanwar Singh Shekhawat plotting revenge, the stakes have never been higher.',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2-_The_Rule.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/bRRUMiUlMDqK0VDDL5eDMoOjEE0.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=1kVK0MZlbI4',
    genres: ['Action', 'Drama', 'Thriller'],
    language: 'Telugu',
    languages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
    formats: ['2D', 'IMAX', '3D'],
    duration: 179,
    releaseDate: '2024-12-05',
    rating: { imdb: 7.2, rottenTomatoes: 78, userRating: 8.5 },
    certification: 'UA',
    cast: [
      { name: 'Allu Arjun', role: 'Pushpa Raj', imageUrl: 'https://wowhyderabad.com/wp-content/uploads/2023/12/Allu-Arjun2-2-scaled.jpg' },
      { name: 'Rashmika Mandanna', role: 'Srivalli', imageUrl: 'https://th-i.thgim.com/public/incoming/f7r0t8/article69841913.ece/alternates/PORTRAIT_1200/DSC3040.JPG' },
      { name: 'Fahadh Faasil', role: 'Bhanwar Singh Shekhawat', imageUrl: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/fahadh-faasil-37756-1661702033.jpg' },
    ],
    director: 'Sukumar',
    priceFrom: 150,
    status: 'trending',
  },

{
  id: 'mov-16',
  title: 'Raaka',
  tagline: 'A storm rises. A legend awakens.',
  synopsis:
    'Raaka is a high-octane action thriller starring Allu Arjun in one of his most intense roles yet. Set against a gritty backdrop of crime, politics, and revenge, the film follows a mysterious man whose arrival shakes an entire empire. Packed with stylish action sequences, emotional depth, and larger-than-life moments, Raaka promises a massive cinematic spectacle designed for the big screen.',
  posterUrl:
    'https://cdn.district.in/movies-assets/images/cinema/Raaka-275eaa00-341c-11f1-a05c-1f47ca0d3974.jpg',
  backdropUrl:
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop',
  trailerUrl:
    'https://www.youtube.com/watch?v=3UKmHZOGon4',
  genres: ['Action', 'Thriller', 'Drama'],
  language: 'Telugu',
  languages: ['Telugu', 'Tamil', 'Hindi', 'Malayalam', 'Kannada'],
  formats: ['2D', 'IMAX', '4DX'],
  duration: 167,
  releaseDate: '2026-08-14',
  rating: {
    imdb: 8.4,
    rottenTomatoes: 89,
    userRating: 9.1,
  },
  certification: 'UA16+',
  cast: [
    {
      name: 'Allu Arjun',
      role: 'Raaka',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa1usx47gObaIqVK-4vndqgP2Yg2Xv0FXUug&s',
    },
    {
      name: 'Mrunal Thakur',
      role: 'Female Lead',
      imageUrl:
        'https://technosports.co.in/wp-content/uploads/2025/06/516155650_18349092058094812_4220373050538448540_n.webp',
    },
  ],
  director: 'Atlee',
  priceFrom: 220,
  status: 'trending',
},

  {
    id: 'mov-17',
    title: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    synopsis:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. Cooper, a former pilot turned farmer, must leave his children behind to lead the mission that could save the human race from extinction on a dying Earth. Time bends, love transcends dimension, and the fate of humanity hangs in the balance.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    languages: ['English', 'Hindi'],
    formats: ['2D', 'IMAX'],
    duration: 169,
    releaseDate: '2014-11-07',
    rating: { imdb: 8.7, rottenTomatoes: 73, userRating: 9.3 },
    certification: 'UA',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjtaged1DCpiobMc9n64sm7iCdAVRn3lxkxb43setebf_8UYI9G8K5aJe50UWsODzMjxUdz6NIgF4F4KaCJD31_O-5l6eC9zbP6SnNpdJe3A&s=10' },
      { name: 'Anne Hathaway', role: 'Brand', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5H48ATyPemqNeKLl7gAG5Nt_OCtFRX5hE7WbwuA-mmKwyyFD0KaTHekBefgfHD0qKFNTjv3wPD8-YRPVKSwORoG0JXI9UA8pEmgSTtpqtGw&s=10' },
      { name: 'Jessica Chastain', role: 'Murph', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQFBXNIDjKIMPqnk12azez1wIVCIT-zBj0T5c6JEmRZ2eWhf0SBncemSKIObrUUwKtDrsSnSl8dGvk0VSRb2ZDsbXDczs6x0zALItELRnJ&s=10' },
    ],
    director: 'Christopher Nolan',
    priceFrom: 250,
    status: 'trending',
  },

  {
    id: 'mov-18',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    synopsis:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. A haunting exploration of the man behind the weapon that changed the world, his moral dilemmas, and the political fallout that followed. Christopher Nolan\'s epic is a cinematic reckoning with genius, guilt, and consequence.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    genres: ['Drama', 'Biography', 'History'],
    language: 'English',
    languages: ['English', 'Hindi'],
    formats: ['2D', 'IMAX'],
    duration: 180,
    releaseDate: '2023-07-21',
    rating: { imdb: 8.3, rottenTomatoes: 93, userRating: 8.9 },
    certification: 'A',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7n5yzXAg3EPLHxwyR4Q1UHNFZH5bnz40OG2NOG5rTlqg7QLCA3ZIh-sI22pSjhkp9M6c1kRif3I0ANKYC8iybB0gxJg6AAyYMfdg0g7FE&s=10' },
      { name: 'Emily Blunt', role: 'Kitty Oppenheimer', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTcOHRwh9NBk7GoDT125RyIhOuFZasceM7gdtXGjuQtT2VFCVUhCpRmJV8pVxeZbkn3C3gpUzKn9N-QRr1ZRDgyWozFfRHKlu_XmyDzHAzDM8jaz86U-gU-puZm4meEFVshlYpnsXVdHQc&s=19' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR5Kd-LGRdtuYk8GM2uqUKSUiKKEG03Q2-UYnUDchfFuKpA89CHctasSk6XhSLbc_9wDy2a4YFGqszRmGOd3NWuZWt1hs6Af8cNqpaiQ5gP-qjPs3QXNouFrmFKI-8fHB_yroJ7S_emf1X9&s=19' },
    ],
    director: 'Christopher Nolan',
    priceFrom: 200,
    status: 'trending',
  },

{
  id: 'mov-19',
  title: 'Avengers: Doomsday',
  tagline: 'A new era of heroes begins.',
  synopsis:
    'The Avengers assemble once again to face their most dangerous threat yet — Doctor Doom. As multiversal chaos spreads across realities, Earth’s mightiest heroes must unite with unexpected allies to stop a catastrophic war that could destroy every universe. Packed with epic action, emotional stakes, and massive MCU surprises, Avengers: Doomsday promises to redefine the future of Marvel.',
  posterUrl: 'https://cdn.district.in/movies-assets/images/cinema/Avengers--Doomsday-ccbe00a0-e08d-11f0-b2bc-f3e999e3e4f7.jpg?im=Resize,width=400',
  backdropUrl: 'https://image.tmdb.org/t/p/original/avengers_doomsday_backdrop.jpg',
  trailerUrl: 'https://www.youtube.com/watch?v=-8hwRjBHscM',
  genres: ['Action', 'Sci-Fi', 'Adventure'],
  language: 'English',
  languages: ['English', 'Tamil', 'Telugu', 'Hindi', 'Malayalam'],
  formats: ['2D', '3D', 'IMAX', '4DX'],
  duration: 180,
  releaseDate: '2026-12-18',
  rating: { imdb: 0, rottenTomatoes: 0, userRating: 0 },
  certification: 'UA13+',
  cast: [
    { name: 'Robert Downey Jr.', role: 'Doctor Doom', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR5Kd-LGRdtuYk8GM2uqUKSUiKKEG03Q2-UYnUDchfFuKpA89CHctasSk6XhSLbc_9wDy2a4YFGqszRmGOd3NWuZWt1hs6Af8cNqpaiQ5gP-qjPs3QXNouFrmFKI-8fHB_yroJ7S_emf1X9&s=19' },
    { name: 'Anthony Mackie', role: 'Captain America', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR54CqxILAKKTvckUYsyJbmwD-Z6bL24hFOQI5nKTXxcgI9tiwinPCB9k0sxCGCBBmosIsIeura17G0lA7pcrEghCUd4jJWv796wr_7ZByeCA&s=10' },
    { name: 'Tom Holland', role: 'Spider-Man', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKT1_oWMU2qS4mjB-wNqll7d9X67UVvxn8VEGvApavkSj-bsXkWYpEs9B06tluPiz78X5P7HsOXsL2pmmsJfhK5fsip9UPwK6sjAclCcrN&s=10' },
    { name: 'Benedict Cumberbatch', role: 'Doctor Strange', imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSMGFyRi5gtT6fSJxxW_Hxmiax-swG8GLs9tqsqWiAAGdaLy-EIu0wosIsy8ybsr_VQoPro68FWMAcEClii0DcyrEmpqOfHQMFLgkXQVP8JZpTYdmw2e2XsbOXendVBdmd49ySrEx6cDBU&s=19' },
  ],
  director: 'Russo Brothers',
  priceFrom: 350,
  status: 'coming_soon',
},

{
    id: 'mov-21',
    title: 'DC',
    tagline: 'A blood-soaked nightmare of passion and peril.',
    synopsis:
      'A dark, gritty, and violent modern-day reimagining of the classic Devdas story. The film follows Devadas, a rugged gangster fleeing the law, who crosses paths and becomes entangled with Chandra, a doctor on the run. Together, they embark on a dangerous journey of deep romance and survival amidst chaos, gunfights, and corruption.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDM5YWY5MjEtMzQ5Ny00OGYwLTkyMjMtODdmY2ExZTk3ZGY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    backdropUrl: 'https://tmdb.org',
    trailerUrl: 'https://www.youtube.com/watch?v=2kntxizQIFI',
    genres: ['Action', 'Romance', 'Crime', 'Drama'],
    language: 'Tamil',
    languages: ['Tamil', 'Telugu', 'Hindi'],
    formats: ['2D', 'IMAX'],
    duration: 155,
    releaseDate: '2026-06-12',
    rating: { imdb: 0, rottenTomatoes: 0, userRating: 0 },
    certification: 'A',
    cast: [
      { name: 'Lokesh Kanagaraj', role: 'Devadas', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZjFjY2JhYzEtYjcxOS00ZjVkLWE0MzYtYTI5MTNiNDliMTZiXkEyXkFqcGc@._V1_.jpg' },
      { name: 'Wamiqa Gabbi', role: 'Chandra', imageUrl: 'https://thehawk.sgp1.cdn.digitaloceanspaces.com/daece7c0-44e0-41a0-97ad-fbad17425be5/202505143402951-81fded3b-e368-4a58-9a00-ec3517098d58.jpg' },
    ],
    director: 'Arun Matheswaran',
    priceFrom: 250,
    status: 'coming_soon',
},
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Cinemas
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export const cinemas: Cinema[] = [
  {
    id: 'cin-1',
    name: 'PVR INOX Phoenix Palladium',
    address: 'Lower Parel, Mumbai',
    city: 'Mumbai',
    distance: 3.2,
    facilities: ['Dolby Atmos', 'Recliner', 'F&B', 'Parking', 'Wheelchair Access'],
    shows: [],
  },
  {
    id: 'cin-2',
    name: 'INOX Megaplex Inorbit',
    address: 'Malad West, Mumbai',
    city: 'Mumbai',
    distance: 8.5,
    facilities: ['IMAX', 'Dolby Atmos', 'F&B', 'Parking'],
    shows: [],
  },
  {
    id: 'cin-3',
    name: 'Cinépolis Fun Republic',
    address: 'Andheri West, Mumbai',
    city: 'Mumbai',
    distance: 6.1,
    facilities: ['4DX', 'Dolby Atmos', 'F&B', 'Parking', 'VIP Lounge'],
    shows: [],
  },
  {
    id: 'cin-4',
    name: 'PVR Director\'s Cut',
    address: 'Ambience Mall, Gurgaon',
    city: 'Delhi-NCR',
    distance: 12.3,
    facilities: ['Dolby Atmos', 'Recliner', 'F&B', 'Valet Parking', 'VIP Lounge'],
    shows: [],
  },
  {
    id: 'cin-5',
    name: 'INOX Insignia',
    address: 'Koramangala, Bengaluru',
    city: 'Bengaluru',
    distance: 4.7,
    facilities: ['IMAX', 'Dolby Atmos', 'Recliner', 'F&B', 'Parking'],
    shows: [],
  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Shows (generated for movies at cinemas)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

function generateShows(): Show[] {
  const shows: Show[] = []
  const today = new Date()
  const times = ['09:30', '12:45', '15:30', '18:15', '21:00', '23:30']
  const formats: Array<'2D' | 'IMAX' | '3D'> = ['2D', 'IMAX', '3D']

  movies
    .filter(m => m.status === 'now_showing' || m.status === 'trending')
    .forEach(movie => {
      cinemas.forEach(cinema => {
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const date = new Date(today)
          date.setDate(date.getDate() + dayOffset)
          const dateStr = date.toISOString().split('T')[0]

          const selectedTimes = times.filter(() => Math.random() > 0.3)
          selectedTimes.forEach((time, idx) => {
            const format = formats[idx % formats.length]
            const totalSeats = 150 + Math.floor(Math.random() * 100)
            const available = Math.floor(totalSeats * (0.3 + Math.random() * 0.6))
            shows.push({
              id: `show-${movie.id}-${cinema.id}-${dateStr}-${time.replace(':', '')}`,
              movieId: movie.id,
              cinemaId: cinema.id,
              time,
              date: dateStr,
              format,
              language: movie.languages[Math.floor(Math.random() * Math.min(2, movie.languages.length))],
              availableSeats: available,
              totalSeats,
              pricing: [
                { category: 'RECLINER', price: 600, available: Math.floor(available * 0.1), total: Math.floor(totalSeats * 0.1) },
                { category: 'PREMIUM', price: 400, available: Math.floor(available * 0.2), total: Math.floor(totalSeats * 0.2) },
                { category: 'EXECUTIVE', price: 280, available: Math.floor(available * 0.3), total: Math.floor(totalSeats * 0.3) },
                { category: 'NORMAL', price: 150, available: Math.floor(available * 0.4), total: Math.floor(totalSeats * 0.4) },
              ],
            })
          })
        }
      })
    })
  return shows
}

export const shows: Show[] = generateShows()

// Attach shows to cinemas
cinemas.forEach(cinema => {
  cinema.shows = shows.filter(s => s.cinemaId === cinema.id)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Seat Layout Generator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export function generateSeatLayout(showId: string): SeatLayout {
  const rows = 'ABCDEFGHIJKLMNOP'.split('')

  const makeRow = (label: string, count: number, category: 'RECLINER' | 'PREMIUM' | 'EXECUTIVE' | 'NORMAL', price: number) => ({
    label,
    seats: Array.from({ length: count }, (_, i) => ({
      id: `${showId}-${label}${i + 1}`,
      row: label,
      number: i + 1,
      category,
      status: Math.random() > 0.35 ? 'available' as const : 'occupied' as const,
      price,
    })),
  })

  return {
    showId,
    sections: [
      {
        category: 'RECLINER',
        price: 600,
        rows: [makeRow(rows[0], 10, 'RECLINER', 600), makeRow(rows[1], 10, 'RECLINER', 600)],
      },
      {
        category: 'PREMIUM',
        price: 400,
        rows: [makeRow(rows[2], 14, 'PREMIUM', 400), makeRow(rows[3], 14, 'PREMIUM', 400), makeRow(rows[4], 14, 'PREMIUM', 400)],
      },
      {
        category: 'EXECUTIVE',
        price: 280,
        rows: [
          makeRow(rows[5], 16, 'EXECUTIVE', 280),
          makeRow(rows[6], 16, 'EXECUTIVE', 280),
          makeRow(rows[7], 16, 'EXECUTIVE', 280),
          makeRow(rows[8], 16, 'EXECUTIVE', 280),
        ],
      },
      {
        category: 'NORMAL',
        price: 150,
        rows: [
          makeRow(rows[9], 18, 'NORMAL', 150),
          makeRow(rows[10], 18, 'NORMAL', 150),
          makeRow(rows[11], 18, 'NORMAL', 150),
          makeRow(rows[12], 18, 'NORMAL', 150),
          makeRow(rows[13], 18, 'NORMAL', 150),
        ],
      },
    ],
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Food & Beverages
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export const fnbItems: FnBItem[] = [
  {
    id: 'fnb-1',
    name: 'Movie Night Combo',
    description: 'Large Popcorn + 2 Regular Coke',
    imageUrl: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/FOOD_CATALOG/IMAGES/CMS/2024/12/17/02565e2c-a75e-4327-baa3-6d8fabc82466_6d59f234-e3a8-47cc-9dce-ed85c01d60cb.jpg',
    category: 'combo',
    price: 499,
    calories: 850,
    isVeg: true,
  },
  {
    id: 'fnb-2',
    name: 'Couple Combo',
    description: 'Large Tub Popcorn + 2 Large Coke + Nachos',
    imageUrl: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/FOOD_CATALOG/IMAGES/CMS/2024/12/17/829a71cb-6f19-4880-9cf4-1b906fb9c4b9_2cd65820-f463-4315-908c-2457e4d6df8b.jpg',
    category: 'combo',
    price: 699,
    calories: 1200,
    isVeg: true,
  },
  {
    id: 'fnb-3',
    name: 'Classic Salted Popcorn',
    description: 'Freshly popped with just the right amount of salt',
    imageUrl: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/2/25/54f9087c-0ed0-4b2d-a2e6-148670476cb1_c364dd17-ca44-4f6f-8029-c91495b86a61.jpg',
    category: 'popcorn',
    sizes: [
      { label: 'S', price: 150, calories: 200 },
      { label: 'M', price: 250, calories: 350 },
      { label: 'L', price: 350, calories: 500 },
    ],
    price: 150,
    calories: 200,
    isVeg: true,
  },
  {
    id: 'fnb-4',
    name: 'Cheese Popcorn',
    description: 'Coated with premium cheddar cheese seasoning',
    imageUrl: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/2/25/6e5b31fd-4e8e-424b-b21a-a8405550521a_fdd1b0bf-6e1e-4650-bd5e-982b12c6cd83.jpg',
    category: 'popcorn',
    sizes: [
      { label: 'S', price: 180, calories: 280 },
      { label: 'M', price: 280, calories: 400 },
      { label: 'L', price: 380, calories: 550 },
    ],
    price: 180,
    calories: 280,
    isVeg: true,
  },
  {
    id: 'fnb-5',
    name: 'Loaded Nachos',
    description: 'Crispy nachos with cheese dip and jalapeños',
    imageUrl: 'https://dailydishrecipes.com/wp-content/uploads/2014/06/Easy-Loaded-Beef-Nachos-Featured-Image-1.jpg',
    category: 'nachos',
    price: 249,
    calories: 420,
    isVeg: true,
  },
  {
    id: 'fnb-6',
    name: 'Coca-Cola',
    description: 'Ice cold Coca-Cola',
    imageUrl: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/11/28/c0b09d00-164e-40c5-a92b-d38084f67dae_601.png',
    category: 'beverage',
    sizes: [
      { label: 'S', price: 100, calories: 140 },
      { label: 'M', price: 150, calories: 210 },
      { label: 'L', price: 200, calories: 280 },
    ],
    price: 100,
    calories: 140,
    isVeg: true,
  },
  {
    id: 'fnb-7',
    name: 'Chicken Hot Dog',
    description: 'Grilled chicken sausage with mustard and onions',
    imageUrl: 'https://b.zmtcdn.com/data/dish_photos/928/e77dd25bb5d83c5837aaddb54b796928.jpeg',
    category: 'snack',
    price: 199,
    calories: 350,
    isVeg: false,
  },
  {
    id: 'fnb-8',
    name: 'Water Bottle',
    description: '1L packaged drinking water',
    imageUrl: 'https://m.media-amazon.com/images/I/51kAt1pAd8L.jpg',
    category: 'beverage',
    price: 40,
    calories: 0,
    isVeg: true,
  },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Promo Codes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export const promoCodes: PromoCode[] = [
  { code: 'FIRST50', discount: 50, maxDiscount: 200, minOrder: 300, description: '50% off on your first booking!', validUntil: '2026-12-31' },
  { code: 'MOVIE20', discount: 20, maxDiscount: 150, minOrder: 500, description: '20% off on any booking', validUntil: '2026-06-30' },
  { code: 'WEEKEND15', discount: 15, maxDiscount: 100, minOrder: 400, description: '15% off on weekend shows', validUntil: '2026-12-31' },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mock user
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export const mockUser: User = {
  id: 'user-1',
  name: 'Shrijith R',
  email: 'shri@gmail.com',
  phone: '+91 63803 68540',
  preferredCity: 'Mumbai',
  notifications: true,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mock bookings
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

export const mockBookings: Booking[] = [
  {
    id: 'MSN8KL2XYZ',
    movieId: 'mov-2',
    movie: movies[1],
    cinemaId: 'cin-1',
    cinema: cinemas[0],
    showId: 'show-1',
    show: shows[0] || {
      id: 'show-1', movieId: 'mov-2', cinemaId: 'cin-1',
      time: '18:15', date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      format: 'IMAX' as const, language: 'English', availableSeats: 120, totalSeats: 200,
      pricing: [
        { category: 'RECLINER' as const, price: 600, available: 10, total: 20 },
        { category: 'PREMIUM' as const, price: 400, available: 30, total: 50 },
        { category: 'EXECUTIVE' as const, price: 280, available: 40, total: 60 },
        { category: 'NORMAL' as const, price: 150, available: 40, total: 70 },
      ],
    },
    seats: [
      { id: 'D5', row: 'D', number: 5, category: 'PREMIUM', status: 'selected', price: 400 },
      { id: 'D6', row: 'D', number: 6, category: 'PREMIUM', status: 'selected', price: 400 },
    ],
    fnbItems: [],
    subtotal: 800,
    convenienceFee: 56,
    discount: 0,
    total: 856,
    paymentMethod: 'Credit Card',
    status: 'confirmed',
    bookedAt: new Date(Date.now() - 86400000).toISOString(),
    qrCode: 'MSN8KL2XYZ',
  },
]
