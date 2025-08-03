

export default function DarkModeBtn({toggle, isDarkMode}) {
  return (
    <button className="dark-mode-toggle-btn" onClick={toggle}>
        {isDarkMode? 'Light Mode':'Dark Mode'}
    </button>
  )
}
