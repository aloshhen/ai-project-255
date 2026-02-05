import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Grid, Camera, Mail, Instagram, Download, ZoomIn } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// SafeIcon Component
const SafeIcon = ({ name, size = 24, className, color }) => {
  const icons = {
    X, ChevronLeft, ChevronRight, Grid, Camera, Mail, Instagram, Download, ZoomIn
  }

  const IconComponent = icons[name] || (() => null)
  return <IconComponent size={size} className={className} color={color} />
}

// Gallery data with user provided images - 3 unique photos
const galleryImages = [
  {
    id: 1,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770331158-3974.jpg?',
    title: 'Момент 1',
    category: 'Портфолио',
    description: 'Захватывающий момент, запечатленный в объектив'
  },
  {
    id: 2,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770331159-5207.jpg?',
    title: 'Момент 2',
    category: 'Портфолио',
    description: 'Уникальный ракурс и композиция'
  },
  {
    id: 3,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770331160-9679.jpg?',
    title: 'Момент 3',
    category: 'Портфолио',
    description: 'Искусство света и тени'
  }
]

// Lightbox Component
const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('lightbox-open')
    } else {
      document.body.classList.remove('lightbox-open')
    }
    return () => document.body.classList.remove('lightbox-open')
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNext, onPrev])

  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 touch-manipulation"
            aria-label="Закрыть"
          >
            <SafeIcon name="X" size={28} className="text-white" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 touch-manipulation hidden md:flex"
            aria-label="Предыдущее"
          >
            <SafeIcon name="ChevronLeft" size={32} className="text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 touch-manipulation hidden md:flex"
            aria-label="Следующее"
          >
            <SafeIcon name="ChevronRight" size={32} className="text-white" />
          </button>

          {/* Image container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-[95vw] max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.src}
              alt={currentImage.title}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />

            {/* Image info overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl text-center max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-1">{currentImage.title}</h3>
              <p className="text-gray-300 text-sm mb-2">{currentImage.description}</p>
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">
                {currentIndex + 1} / {images.length}
              </span>
            </motion.div>
          </motion.div>

          {/* Mobile swipe hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden text-white/50 text-sm flex items-center gap-2">
            <span>Свайп для навигации</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Gallery Item Component
const GalleryItem = ({ image, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-900"
      onClick={onClick}
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
        >
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white mb-2">
            {image.category}
          </span>
          <h3 className="text-xl font-bold text-white mb-1">{image.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-2">{image.description}</p>
        </motion.div>

        <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <SafeIcon name="ZoomIn" size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  )
}

function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  const openLightbox = useCallback((index) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }, [])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <SafeIcon name="Camera" size={24} className="text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight">PhotoGallery</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">Галерея</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">О проекте</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Контакты</a>
          </nav>

          <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
            <SafeIcon name="Grid" size={24} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-6"
            >
              Визуальное искусство
            </motion.span>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Галерея
              </span>
              <br />
              <span className="text-white">моментов</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Коллекция фотографий, захватывающих эмоции, природу и красоту окружающего мира.
              Погрузитесь в визуальное путешествие.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Смотреть галерею
                <SafeIcon name="ChevronRight" size={20} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* Featured images preview - showing all 3 user photos */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 grid grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className={cn(
                  "relative rounded-2xl overflow-hidden shadow-2xl",
                  idx === 1 ? "transform -translate-y-8" : ""
                )}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-48 md:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Коллекция работ</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Каждая фотография рассказывает свою историю. Нажмите на изображение для просмотра в полном разрешении.
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {galleryImages.map((image, index) => (
                <GalleryItem
                  key={image.id}
                  image={image}
                  index={index}
                  onClick={() => openLightbox(index)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 md:px-6 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                О <span className="gradient-text">проекте</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Эта галерея — результат страсти к фотографии и стремления запечатлеть
                самые яркие моменты жизни. Каждый снимок проходит тщательную обработку
                и отбор, чтобы передать зрителю именно ту эмоцию, что была в момент съемки.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-500 mb-1">3</div>
                  <div className="text-sm text-gray-500">Фотографии</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-pink-500 mb-1">1</div>
                  <div className="text-sm text-gray-500">Проект</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-red-500 mb-1">100%</div>
                  <div className="text-sm text-gray-500">Вдохновения</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30" />
              <img
                src={galleryImages[0].src}
                alt="Featured work"
                className="relative rounded-3xl w-full shadow-2xl object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Связаться</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Есть вопросы или предложения о сотрудничестве? Буду рад обсудить!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@example.com"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold transition-all hover:scale-105 touch-manipulation"
              >
                <SafeIcon name="Mail" size={20} />
                Написать email
              </a>
              <a
                href="#"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold transition-all hover:bg-white/10 hover:scale-105 touch-manipulation"
              >
                <SafeIcon name="Instagram" size={20} />
                Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
              <SafeIcon name="Camera" size={20} className="text-white" />
            </div>
            <span className="font-bold">PhotoGallery</span>
          </div>

          <p className="text-gray-500 text-sm">
            © 2024 Все права защищены
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation"
            aria-label="Наверх"
          >
            <SafeIcon name="ChevronRight" size={20} className="transform -rotate-90" />
          </button>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  )
}

export default App