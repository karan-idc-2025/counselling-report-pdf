// Extract cluster data from AI recommendations
function extractClusterData(data) {
    const clusterData = [];
    
    // Get primary clusters
    if (data.ai_recommendation_structured?.careerClusters?.primary) {
        data.ai_recommendation_structured.careerClusters.primary.forEach(cluster => {
            const courses = data.ai_recommendation_structured.coursesAfter12
                .filter(c => c.cluster === cluster.title)
                .flatMap(c => c.courses.map(course => course.courseName));
            
            const colleges = data.ai_recommendation_structured.collegeOptions
                .filter(c => c.cluster === cluster.title)
                .flatMap(c => c.colleges.map(college => college.collegeName))
                .slice(0, 10);
            
            const exams = data.ai_recommendation_structured.entranceExams
                .filter(e => e.cluster === cluster.title)
                .flatMap(e => e.exams.map(exam => exam.examName));
            
            clusterData.push({
                title: cluster.title,
                topCareers: cluster.topCareers || [],
                courses: courses || [],
                colleges: colleges || [],
                exams: exams || []
            });
        });
    }
    
    // If we don't have 3 clusters, add backup clusters
    if (clusterData.length < 3 && data.ai_recommendation_structured?.careerClusters?.backup) {
        data.ai_recommendation_structured.careerClusters.backup.forEach(cluster => {
            if (clusterData.length >= 3) return;
            
            const courses = data.ai_recommendation_structured.coursesAfter12
                .filter(c => c.cluster === cluster.title)
                .flatMap(c => c.courses.map(course => course.courseName));
            
            const colleges = data.ai_recommendation_structured.collegeOptions
                .filter(c => c.cluster === cluster.title)
                .flatMap(c => c.colleges.map(college => college.collegeName))
                .slice(0, 10);
            
            const exams = data.ai_recommendation_structured.entranceExams
                .filter(e => e.cluster === cluster.title)
                .flatMap(e => e.exams.map(exam => exam.examName));
            
            clusterData.push({
                title: cluster.title,
                topCareers: cluster.topCareers || [],
                courses: courses || [],
                colleges: colleges || [],
                exams: exams || []
            });
        });
    }
    
    return clusterData;
}

module.exports = { extractClusterData };