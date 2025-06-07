"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  keywords?: string[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [events, setEvents] = useState<Event[]>([]);

  const handleSearch = async () => {
    console.log('搜索觸發，輸入：', { searchQuery, date, eventType, location });
    try {
      const eventsRef = collection(db, 'events');
      let q = query(eventsRef);
      if (searchQuery) {
        q = query(q, where('keywords', 'array-contains', searchQuery.toLowerCase()));
      }
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        q = query(q, where('date', '==', formattedDate));
      }
      if (eventType) {
        q = query(q, where('type', '==', eventType));
      }
      if (location) {
        q = query(q, where('location', '==', location));
      }
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      setEvents(eventsData);
    } catch (error) {
      console.error('搜索錯誤：', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">LiveRadar：尋找你的音樂活動</h1>
      <div className="flex gap-4 mb-6">
        <Input
          id="search-query"
          name="search-query"
          type="text"
          placeholder="按藝人、場地或關鍵詞搜索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>搜索</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>選擇日期</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Select id="event-type-select" name="event-type" onValueChange={setEventType} value={eventType}>
          <SelectTrigger>
            <SelectValue placeholder="選擇活動類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="concert">演唱會</SelectItem>
            <SelectItem value="festival">音樂節</SelectItem>
            <SelectItem value="performance">表演</SelectItem>
          </SelectContent>
        </Select>
        <Select id="location-select" name="location" onValueChange={setLocation} value={location}>
          <SelectTrigger>
            <SelectValue placeholder="選擇地點" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="taipei">台北</SelectItem>
            <SelectItem value="kaohsiung">高雄</SelectItem>
            <SelectItem value="taichung">台中</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-4 border rounded">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>日期：{event.date}</p>
              <p>地點：{event.location}</p>
              <p>類型：{event.type}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-lg">活動列表將根據你的搜索和過濾條件顯示在此處。</p>
        )}
      </div>
    </div>
  );
}
