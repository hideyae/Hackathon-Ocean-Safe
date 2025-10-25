import { useState, useRef } from 'react';
import { Search, Filter, Send, Mic, Camera, Heart, MessageCircle, MapPin, Clock, User, X, Upload } from 'lucide-react';

interface CommunityPost {
    id: string;
    userName: string;
    userAvatar?: string;
    topic: string;
    location: string;
    timestamp: Date;
    type: 'text' | 'photo' | 'audio';
    content: string;
    photoUrl?: string;
    audioUrl?: string;
    likes: number;
    comments: number;
    isLiked: boolean;
}

const TOPICS = [
    'Marine Life Sighting',
    'Water Quality',
    'Beach Conditions',
    'Safety Alert',
    'Pollution Report',
    'Weather Update',
    'General Discussion'
];

const MOCK_POSTS: CommunityPost[] = [
    {
        id: '1',
        userName: 'Sara Manar',
        topic: 'Marine Life Sighting',
        location: 'Santa Monica, CA',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text',
        content: 'Just spotted a pod of dolphins near the pier! They were incredibly close to shore. What an amazing sight! 🐬',
        likes: 24,
        comments: 5,
        isLiked: false
    },
    {
        id: '2',
        userName: 'Ali Khan',
        topic: 'Beach Conditions',
        location: 'Malibu Beach, CA',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        type: 'photo',
        content: 'Beach is looking perfect today! Calm waters and great visibility.',
        photoUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
        likes: 18,
        comments: 3,
        isLiked: true
    },
    {
        id: '3',
        userName: 'Aya MALIK',
        topic: 'Safety Alert',
        location: 'Agadir, Morocco',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: 'text',
        content: 'Strong riptide warning in effect. Please be cautious and swim near lifeguard stations only.',
        likes: 42,
        comments: 8,
        isLiked: false
    }
];

export function CommunitySection() {
    const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [filterType, setFilterType] = useState<'all' | 'text' | 'photo' | 'audio'>('all');
    const [showFilters, setShowFilters] = useState(false);

    // New post state
    const [newPostType, setNewPostType] = useState<'text' | 'photo' | 'audio'>('text');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTopic, setNewPostTopic] = useState(TOPICS[0]);
    const [newPostLocation, setNewPostLocation] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioBlob(audioBlob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitPost = () => {
        if (!newPostContent.trim() && !selectedPhoto && !audioUrl) {
            alert('Please add some content to your post');
            return;
        }
        if (!newPostLocation.trim()) {
            alert('Please add a location');
            return;
        }

        const newPost: CommunityPost = {
            id: Date.now().toString(),
            userName: 'You',
            topic: newPostTopic,
            location: newPostLocation,
            timestamp: new Date(),
            type: newPostType,
            content: newPostContent,
            photoUrl: selectedPhoto || undefined,
            audioUrl: audioUrl || undefined,
            likes: 0,
            comments: 0,
            isLiked: false
        };

        setPosts([newPost, ...posts]);

        // Reset form
        setNewPostContent('');
        setNewPostLocation('');
        setSelectedPhoto(null);
        setAudioUrl(null);
        setAudioBlob(null);
        setNewPostType('text');
    };

    const toggleLike = (postId: string) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
                : post
        ));
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        return `${days}d ago`;
    };

    const filteredPosts = posts
        .filter(post => {
            const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTopic = !selectedTopic || post.topic === selectedTopic;
            const matchesLocation = !filterLocation || post.location.toLowerCase().includes(filterLocation.toLowerCase());
            const matchesType = filterType === 'all' || post.type === filterType;

            return matchesSearch && matchesTopic && matchesLocation && matchesType;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return b.timestamp.getTime() - a.timestamp.getTime();
            } else {
                return a.timestamp.getTime() - b.timestamp.getTime();
            }
        });

    return (
        <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
                <div className="flex flex-col gap-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search topics, locations, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all self-start"
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                                <select
                                    value={selectedTopic}
                                    onChange={(e) => setSelectedTopic(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                >
                                    <option value="">All Topics</option>
                                    {TOPICS.map(topic => (
                                        <option key={topic} value={topic}>{topic}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    placeholder="Filter by location"
                                    value={filterLocation}
                                    onChange={(e) => setFilterLocation(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                >
                                    <option value="all">All Types</option>
                                    <option value="text">Text Only</option>
                                    <option value="photo">Photos Only</option>
                                    <option value="audio">Audio Only</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Post Section */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-xl p-6 border-2 border-cyan-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Share a Report</h3>

                {/* Post Type Selector */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setNewPostType('text')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${newPostType === 'text'
                            ? 'bg-cyan-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        Text
                    </button>
                    <button
                        onClick={() => setNewPostType('photo')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${newPostType === 'photo'
                            ? 'bg-cyan-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Camera className="w-4 h-4" />
                        Photo
                    </button>
                    <button
                        onClick={() => setNewPostType('audio')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${newPostType === 'audio'
                            ? 'bg-cyan-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Mic className="w-4 h-4" />
                        Audio
                    </button>
                </div>

                {/* Topic and Location */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                        <select
                            value={newPostTopic}
                            onChange={(e) => setNewPostTopic(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 bg-white"
                        >
                            {TOPICS.map(topic => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            placeholder="e.g., Santa Monica, CA"
                            value={newPostLocation}
                            onChange={(e) => setNewPostLocation(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 bg-white"
                        />
                    </div>
                </div>

                {/* Content Input Based on Type */}
                {newPostType === 'text' && (
                    <textarea
                        placeholder="Share your observations, reports, or updates..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 mb-4 min-h-[120px] bg-white"
                    />
                )}

                {newPostType === 'photo' && (
                    <div className="mb-4">
                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <Upload className="w-4 h-4" />
                                Upload Photo
                            </button>
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <Camera className="w-4 h-4" />
                                Take Photo
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                        />
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoSelect}
                            className="hidden"
                        />

                        {selectedPhoto && (
                            <div className="relative">
                                <img src={selectedPhoto} alt="Selected" className="w-full h-64 object-cover rounded-lg" />
                                <button
                                    onClick={() => setSelectedPhoto(null)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <textarea
                            placeholder="Add a caption (optional)"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 mt-3 bg-white"
                            rows={2}
                        />
                    </div>
                )}

                {newPostType === 'audio' && (
                    <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            {!isRecording && !audioUrl && (
                                <button
                                    onClick={startRecording}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md"
                                >
                                    <Mic className="w-5 h-5" />
                                    Start Recording
                                </button>
                            )}

                            {isRecording && (
                                <button
                                    onClick={stopRecording}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-md animate-pulse"
                                >
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                    Recording... Click to Stop
                                </button>
                            )}

                            {audioUrl && (
                                <div className="flex items-center gap-3 flex-1">
                                    <audio src={audioUrl} controls className="flex-1" />
                                    <button
                                        onClick={() => {
                                            setAudioUrl(null);
                                            setAudioBlob(null);
                                        }}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <textarea
                            placeholder="Add a description (optional)"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 bg-white"
                            rows={2}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={submitPost}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    <Send className="w-5 h-5" />
                    Post Report
                </button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">
                    Community Reports ({filteredPosts.length})
                </h3>

                {filteredPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-all">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{post.userName}</h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {post.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTime(post.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">
                                {post.topic}
                            </span>
                        </div>

                        {/* Post Content */}
                        {post.type === 'text' && (
                            <p className="text-gray-700 mb-4">{post.content}</p>
                        )}

                        {post.type === 'photo' && (
                            <div className="mb-4">
                                {post.photoUrl && (
                                    <img
                                        src={post.photoUrl}
                                        alt="Post"
                                        className="w-full h-80 object-cover rounded-xl mb-3"
                                    />
                                )}
                                {post.content && (
                                    <p className="text-gray-700">{post.content}</p>
                                )}
                            </div>
                        )}

                        {post.type === 'audio' && (
                            <div className="mb-4">
                                {post.audioUrl && (
                                    <audio src={post.audioUrl} controls className="w-full mb-3" />
                                )}
                                {post.content && (
                                    <p className="text-gray-700">{post.content}</p>
                                )}
                            </div>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center gap-6 pt-4 border-t-2 border-gray-100">
                            <button
                                onClick={() => toggleLike(post.id)}
                                className={`flex items-center gap-2 transition-all ${post.isLiked
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-gray-500 hover:text-red-500'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span className="font-semibold">{post.likes}</span>
                            </button>

                            <button className="flex items-center gap-2 text-gray-500 hover:text-cyan-600 transition-all">
                                <MessageCircle className="w-5 h-5" />
                                <span className="font-semibold">{post.comments}</span>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredPosts.length === 0 && (
                    <div className="bg-gray-50 rounded-2xl p-12 text-center">
                        <p className="text-gray-500 text-lg">No reports found matching your filters.</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}