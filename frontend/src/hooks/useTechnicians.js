import { useQuery } from '@tanstack/react-query'
import { techniciansService } from '../services/technicians.service'

export function useFeaturedTechnicians() {
  return useQuery({
    queryKey: ['technicians', 'featured'],
    queryFn: techniciansService.featured,
  })
}

export function useTechnicianSearch(params) {
  return useQuery({
    queryKey: ['technicians', 'search', params],
    queryFn: () => techniciansService.search(params),
  })
}

export function useTechnician(id) {
  return useQuery({
    queryKey: ['technicians', id],
    queryFn: () => techniciansService.getById(id),
    enabled: !!id,
  })
}
