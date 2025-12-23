# 🌳 Bonsai Buddy

A beautiful, modern web application for bonsai enthusiasts to track, manage, and share their bonsai collections with the community.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with Supabase Auth
- 🌱 **Bonsai Collection Management** - Track your bonsai trees with detailed information
- 📸 **Image Upload** - Upload and store high-quality images with automatic compression
- 🔍 **Search & Discovery** - Find bonsai by name, species, or owner
- ❤️ **Social Features** - Like posts and subscribe to updates from other enthusiasts
- 📊 **Collection Stats** - View statistics about your collection (count, average age, health)
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS and shadcn/ui
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth
- **Package Manager:** [pnpm](https://pnpm.io/)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm installed
- A Supabase account (free tier works great!)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ehenderson828/bonsai-buddy-app.git
   cd bonsai-buddy-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase database**

   Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[Supabase Setup Guide](./SUPABASE_SETUP.md)** - Complete database and authentication setup
- **[Database Schema](./supabase/migrations/001_initial_schema.sql)** - Full database structure
- **[Storage Policies](./supabase/storage-policies.sql)** - Image storage configuration

## 🗂️ Project Structure

```
bonsai-buddy-app/
├── app/                      # Next.js app directory (pages & layouts)
│   ├── page.tsx             # Homepage with community feed
│   ├── profile/             # User profile & add bonsai pages
│   ├── search/              # Search functionality
│   ├── specimen/[id]/       # Individual bonsai detail page
│   └── ...
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Navbar, Footer
│   ├── bonsai/              # Domain-specific components
│   └── providers/           # Context providers
├── lib/
│   ├── supabase/            # Supabase client, queries, types
│   └── utils.ts             # Utility functions
├── supabase/                # Database migrations & policies
└── public/                  # Static assets
```

## 🎯 Key Features Explained

### Authentication
- Email/password authentication via Supabase
- Automatic profile creation on signup
- Persistent sessions with auto-refresh
- Auto-confirmation for development (configurable)

### Bonsai Management
- Create, view, and manage bonsai specimens
- Upload photos with automatic compression (max 1200px, 85% quality)
- Track health status, age, species, and care notes
- View detailed statistics about your collection

### Social Features
- Like and unlike posts from the community
- Subscribe to updates for specific bonsai
- Browse all community bonsai in search
- View update timelines for each specimen

### Image Handling
- Automatic image compression before upload
- File validation (5MB max, JPEG/PNG/WebP)
- Organized storage by user ID
- Optimized delivery via Supabase CDN

## 🔒 Security

- Row Level Security (RLS) enabled on all database tables
- Authentication required for write operations
- Users can only modify their own data
- Public read access for community features
- Secure image upload with validation

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

**Important:** After deployment, update your Supabase **Site URL** and **Redirect URLs** to match your production domain.

## 🧪 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database Management

All database operations are handled through helper functions in `lib/supabase/queries.ts`:
- `getAllPosts()` - Fetch all posts
- `createSpecimen()` - Create a new bonsai
- `likePost()` / `unlikePost()` - Toggle likes
- `subscribeToSpecimen()` - Subscribe to updates
- And more...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database and auth powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Contact

Eric Henderson - [@ehenderson828](https://github.com/ehenderson828)

Project Link: [https://github.com/ehenderson828/bonsai-buddy-app](https://github.com/ehenderson828/bonsai-buddy-app)

---

**Made with 💚 for the bonsai community**
