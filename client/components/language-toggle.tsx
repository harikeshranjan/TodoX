import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/hooks/use-language"
import Image from "next/image";
import { useHotkeys } from "react-hotkeys-hook";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "tr" : "en")
  }
  useHotkeys("shift+l", () => toggleLanguage())

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-full flex items-center gap-2 px-3">
          {language === "en" ? (
            <>
              <Image src="/en.png" alt="English" width={20} height={20} />
              English
            </>
          ) : (
            <>
              <Image src="/tr.png" alt="Türkçe" width={20} height={20} />
              Türkçe
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <Image src="/en.png" width={20} height={20} alt="EN" />
          <span>
            {language === "en" ? "English" : "İngilizce"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("tr")}>
          <Image src="/tr.png" width={20} height={20} alt="EN" />
          <span>
            {language === "en" ? "Turkish" : "Türkçe"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}