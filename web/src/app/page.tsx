import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";

const Home = () => {
  const technologies = [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "Docker",
    "Flutter",
  ];

  return (
    <div className="font-sans grid grid-rows-[min-content_1fr_min-content] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 text-center">
      <div className="flex flex-col gap-[48px] row-start-2 items-center">
        <section className="flex flex-col gap-[24px] items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Sistema SaaS de Lojas Virtuais
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl text-gray-700 dark:text-gray-300">
            Uma solução SaaS completa e escalável para pequenos empreendedores
            criarem e gerenciarem suas lojas virtuais.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="https://github.com/dariomatias-dev/my_commerce/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Explore a documentação
            </a>
          </div>
        </section>

        <section className="w-full max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Contruído com
          </h2>
          <div className="relative w-full max-w-full overflow-hidden mask-fade">
            <div className="flex flex-wrap gap-3 justify-center">
              {[...technologies].map((tech, index) => (
                <span
                  key={index}
                  className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          © {new Date().getFullYear()} Dário Matias. Todos os direitos
          reservados.
        </span>

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://dariomatias-dev.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGlobe aria-hidden size={16} /> Portfolio
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/dariomatias-dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub aria-hidden size={16} />
          GitHub
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/dariomatias-dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin aria-hidden size={16} />
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default Home;
