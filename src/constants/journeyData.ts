export interface Destination {
  id: string;
  name: string;
}

export interface Terminal {
  id: string;
  name: string;
  destinations: Destination[];
}

export interface City {
  id: string;
  name: string;
  terminals: Terminal[];
}

export interface Region {
  id: string;
  name: string;
  cities: City[];
}

export const JOURNEY_DATA: Record<string, Region> = {
  Bihar: {
    id: 'bihar',
    name: 'BIHAR',
    cities: [
      {
        id: 'patna',
        name: 'Patna',
        terminals: [
          {
            id: 'mithapur',
            name: 'Mithapur Bus Stand',
            destinations: [
              { id: 'gaya', name: 'Gaya' },
              { id: 'muzaffarpur', name: 'Muzaffarpur' },
              { id: 'bhagalpur', name: 'Bhagalpur' },
              { id: 'darbhanga', name: 'Darbhanga' }
            ]
          },
          {
            id: 'isbt_patna',
            name: 'ISBT Patna',
            destinations: [
              { id: 'gaya', name: 'Gaya' },
              { id: 'ranchi', name: 'Ranchi' },
              { id: 'siliguri', name: 'Siliguri' }
            ]
          }
        ]
      },
      {
        id: 'gaya',
        name: 'GAYA',
        terminals: [
          {
            id: 'gaya_bus_stand',
            name: 'Gaya Bus Stand',
            destinations: [
              { id: 'patna', name: 'Patna' },
              { id: 'jehanabad', name: 'Jehanabad' },
              { id: 'nawada', name: 'Nawada' }
            ]
          }
        ]
      },
      {
        id: 'aurangabad',
        name: 'AURANGABAD',
        terminals: [
          {
            id: 'aurangabad_stand',
            name: 'Aurangabad Bus Stand',
            destinations: [
              { id: 'dehri', name: 'DEHRI' },
              { id: 'rafiganj', name: 'RAFIGANJ' },
              { id: 'nabinagar', name: 'NABINAGAR' },
              { id: 'daudnagar', name: 'DAUDNAGAR' },
              { id: 'deo', name: 'DEO' },
              { id: 'amba', name: 'AMBA' },
              { id: 'gaya', name: 'GAYA' }
            ]
          }
        ]
      },
      {
        id: 'dehri',
        name: 'DEHRI',
        terminals: [
          {
            id: 'dehri_stand',
            name: 'Dehri On Sone Stand',
            destinations: [
              { id: 'daudnagar', name: 'DAUDNAGAR' },
              { id: 'rafiganj', name: 'RAFIGANJ' },
              { id: 'gaya', name: 'GAYA' }
            ]
          }
        ]
      },
      {
        id: 'rafiganj',
        name: 'RAFIGANJ',
        terminals: [
          {
            id: 'rafiganj_stand',
            name: 'Rafiganj Stand',
            destinations: [
              { id: 'gaya', name: 'GAYA' },
              { id: 'aurangabad', name: 'AURANGABAD' }
            ]
          }
        ]
      },
      {
        id: 'daudnagar',
        name: 'DAUDNAGAR',
        terminals: [
          {
            id: 'daudnagar_stand',
            name: 'Daudnagar Stand',
            destinations: [
              { id: 'aurangabad', name: 'AURANGABAD' },
              { id: 'dehri', name: 'DEHRI' }
            ]
          }
        ]
      },
      {
        id: 'nabinagar',
        name: 'NABINAGAR',
        terminals: [
          {
            id: 'nabinagar_stand',
            name: 'Nabinagar Stand',
            destinations: [
              { id: 'aurangabad', name: 'AURANGABAD' },
              { id: 'dehri', name: 'DEHRI' }
            ]
          }
        ]
      },
      {
        id: 'obra',
        name: 'OBRA',
        terminals: [
          {
            id: 'obra_stand',
            name: 'Obra Stand',
            destinations: [
              { id: 'daudnagar', name: 'DAUDNAGAR' },
              { id: 'aurangabad', name: 'AURANGABAD' }
            ]
          }
        ]
      }
    ]
  },
  Delhi: {
    id: 'delhi',
    name: 'DELHI',
    cities: [
      {
        id: 'new_delhi',
        name: 'New Delhi',
        terminals: [
          {
            id: 'isbt_kashmere_gate',
            name: 'ISBT Kashmere Gate',
            destinations: [
              { id: 'chandigarh', name: 'Chandigarh' },
              { id: 'shimla', name: 'Shimla' },
              { id: 'manali', name: 'Manali' },
              { id: 'dehradun', name: 'Dehradun' }
            ]
          },
          {
            id: 'anand_vihar',
            name: 'Anand Vihar ISBT',
            destinations: [
              { id: 'lucknow', name: 'Lucknow' },
              { id: 'kanpur', name: 'Kanpur' },
              { id: 'agra', name: 'Agra' }
            ]
          }
        ]
      }
    ]
  },
  Maharashtra: {
    id: 'maharashtra',
    name: 'MAHARASHTRA',
    cities: [
      {
        id: 'mumbai',
        name: 'Mumbai',
        terminals: [
          {
            id: 'borivali_nancy',
            name: 'Borivali Nancy Colony',
            destinations: [
              { id: 'pune', name: 'Pune' },
              { id: 'goa', name: 'Goa' },
              { id: 'ahmedabad', name: 'Ahmedabad' }
            ]
          },
          {
            id: 'dadar',
            name: 'Dadar TT',
            destinations: [
              { id: 'pune', name: 'Pune' },
              { id: 'kolhapur', name: 'Kolhapur' }
            ]
          }
        ]
      }
    ]
  },
  Rajasthan: {
    id: 'rajasthan',
    name: 'RAJASTHAN',
    cities: [
      {
        id: 'jaipur',
        name: 'Jaipur',
        terminals: [
          {
            id: 'sindhi_camp',
            name: 'Sindhi Camp',
            destinations: [
              { id: 'delhi', name: 'Delhi' },
              { id: 'jodhpur', name: 'Jodhpur' },
              { id: 'udaipur', name: 'Udaipur' },
              { id: 'ajmer', name: 'Ajmer' }
            ]
          }
        ]
      }
    ]
  },
  Uttar_Pradesh: {
    id: 'up',
    name: 'UTTAR PRADESH',
    cities: [
      {
        id: 'lucknow',
        name: 'Lucknow',
        terminals: [
          {
            id: 'kaisarbagh',
            name: 'Kaisarbagh Bus Station',
            destinations: [
              { id: 'delhi', name: 'Delhi' },
              { id: 'kanpur', name: 'Kanpur' },
              { id: 'varanasi', name: 'Varanasi' }
            ]
          }
        ]
      }
    ]
  },
  Himachal: {
    id: 'himachal',
    name: 'HIMACHAL',
    cities: [
      {
        id: 'shimla',
        name: 'Shimla',
        terminals: [
          {
            id: 'isbt_tutikandi',
            name: 'ISBT Tutikandi',
            destinations: [
              { id: 'delhi', name: 'Delhi' },
              { id: 'chandigarh', name: 'Chandigarh' },
              { id: 'manali', name: 'Manali' }
            ]
          }
        ]
      }
    ]
  },
  West_Bengal: {
    id: 'wb',
    name: 'WEST BENGAL',
    cities: [
      {
        id: 'kolkata',
        name: 'Kolkata',
        terminals: [
          {
            id: 'esplanade',
            name: 'Esplanade (Dharmatala)',
            destinations: [
              { id: 'siliguri', name: 'Siliguri' },
              { id: 'digha', name: 'Digha' },
              { id: 'asansol', name: 'Asansol' }
            ]
          }
        ]
      }
    ]
  },
  Gujarat: {
    id: 'gujarat',
    name: 'GUJARAT',
    cities: [
      {
        id: 'ahmedabad',
        name: 'Ahmedabad',
        terminals: [
          {
            id: 'geeta_mandir',
            name: 'Geeta Mandir ST Bus Stand',
            destinations: [
              { id: 'surat', name: 'Surat' },
              { id: 'rajkot', name: 'Rajkot' },
              { id: 'mumbai', name: 'Mumbai' }
            ]
          }
        ]
      }
    ]
  }
};
