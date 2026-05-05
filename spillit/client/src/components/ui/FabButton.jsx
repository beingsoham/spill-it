import { usePostModal } from '../../hooks/usePostModal'
import styles from './FabButton.module.css'

export default function FabButton() {
  const { open } = usePostModal()

  return (
    <button className={styles.fab} onClick={open} aria-label="Spill tea">
      🫖
    </button>
  )
}
