const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

app.use(cors());
// Parse JSON and url-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images, stylesheets, and scripts)
app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads'));

// Define events array with unique identifiers (id property)
const events = [
	{
		id: 1,
		title: 'baby_lamb',
		cover: '/uploads/covers/baby_sheep.jpg',
		images: [
			{ path: '/uploads/events/baby_sheep/baby_1.jpg', alt: 'Baby 1' },
			{ path: '/uploads/events/baby_sheep/baby_2.jpg', alt: 'Baby 2' },
			{ path: '/uploads/events/baby_sheep/baby_3.jpg', alt: 'Baby 3' },
			{ path: '/uploads/events/baby_sheep/baby_4.jpg', alt: 'Baby 4' },
		],
		text: `In this world, a lamb did appear,\nTiny feet strong, no need to fear.\nChildhood sweet, like strawberries dear,\nAn adorable journey, drawing near.`,
	},
	{
		id: 2,
		title: 'child_lamb',
		cover: '/uploads/covers/child_sheep.jpg',
		images: [
			{ path: '/uploads/events/child_sheep/child_1.jpg', alt: 'Child 1' },
			{ path: '/uploads/events/child_sheep/child_2.jpg', alt: 'Child 2' },
		],
		text: `In a cradle of joy, a lamb so sweet,\nTiny hooves dancing to a playful beat.\nCurious eyes, exploring each street,\nA fluffy adventurer, in places to meet.`,
	},
	{
		id: 3,
		title: 'school_lamb',
		cover: '/uploads/covers/teenage_sheep.jpg',
		images: [
			{ path: '/uploads/events/school_sheep/school_1.jpg', alt: 'School 1' },
			{ path: '/uploads/events/school_sheep/school_2.jpg', alt: 'School 2' },
		],
		text: `School years unfold, my lamb in stride,\nIn Dad's shadow, a comforting guide.\nFamily ties strong, love as our pride,\nHumor, sharing, success side by side.`,
	},
	{
		id: 4,
		title: 'dutch_lamb',
		cover: '/uploads/covers/dutch_sheep.jpg',
		images: [
			{ path: '/uploads/events/dutch_sheep/dutch_1.jpg', alt: 'Dutch 1' },
			{ path: '/uploads/events/dutch_sheep/dutch_2.jpg', alt: 'Dutch 2' },
		],
		text: `Guided by winds in Holland's embrace,\nSuccess in business, smiles light up the face.\nLove and career, a harmonious trace,\nA new chapter written in life's warm embrace.`,
	},
	{
		id: 5,
		title: 'married_lamb',
		cover: '/uploads/covers/married_sheep.jpg',
		images: [
			{ path: '/uploads/events/married_sheep/married_1.jpg', alt: 'Married 1' },
			{ path: '/uploads/events/married_sheep/married_2.jpg', alt: 'Married 2' },
		],
		text: `Sloth watches, a friend keeping calm,\nMaster of laughter, chores in love's warm.\nA fairytale marriage, time won't harm,\nEvery moment adds value, love is our charm.`,
	},
];

// Serve the index.html file for the root path
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/events', (req, res) => {
	res.json(events);
});

app.post('/upload', upload.single('image'), (req, res) => {
	// Get the event title from the request body
	const eventTitle = req.body.eventTitle;

	// Find the event by title
	const event = events.find((e) => e.title === eventTitle);

	if (!event) {
		return res.status(404).send('Event not found');
	}

	// Construct the directory path for the event based on its title
	const eventDir = path.join(
		__dirname,
		`./uploads/events/${event.title.toLowerCase().replace(/ /g, '_')}`
	);

	// Ensure the event directory exists; if not, create it
	if (!fs.existsSync(eventDir)) {
		fs.mkdirSync(eventDir, { recursive: true });
	}

	// Generate a unique filename based on the original filename
	const originalFilename = req.file.originalname;
	const fileExtension = path.extname(originalFilename);
	const uniqueFilename = `${Date.now()}${Math.floor(
		Math.random() * 10000
	)}${fileExtension}`;

	// Move the uploaded image to the event directory
	const newPath = path.join(eventDir, uniqueFilename);

	// Move the file
	fs.rename(req.file.path, newPath, (err) => {
		if (err) {
			console.error('Error moving file:', err);
			return res.status(500).send('Error uploading file');
		}

		// Add the new image to the event
		const newImage = {
			path: newPath.replace(__dirname, ''), // Make the path relative to the server root
			alt: originalFilename,
		};
		event.images.push(newImage);

		// Send success response
		res.send('Image uploaded successfully');
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
