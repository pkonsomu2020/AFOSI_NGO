import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Clock, CalendarDays, ArrowLeft, Briefcase,
  ExternalLink, AlertCircle, CheckCircle2, Shield, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import {
  getOpportunityStatus,
  formatDeadline,
  getDaysUntilDeadline,
} from "@/utils/opportunityHelpers";
import { opportunitiesAPI } from "@/services/api";

interface OpportunityDetail {
  id: string;
  title: string;
  type: "consulting" | "employment" | "volunteering";
  description: string;
  location: string;
  duration: string;
  deadline: string;
  manually_disabled: boolean;
  full_description: string | null;
  apply_link: string | null;
  slug: string;
}

const OpportunityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    console.log('🔍 OpportunityDetail: Looking for opportunity with slug/id:', slug);
    
    // Try to determine if the parameter is a UUID (ID) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    console.log('🔍 OpportunityDetail: Is UUID?', isUUID);
    
    const fetchOpportunity = async () => {
      try {
        let response;
        if (isUUID) {
          // If it's a UUID, use getById
          console.log('🔍 OpportunityDetail: Fetching by ID:', slug);
          response = await opportunitiesAPI.getById(slug);
        } else {
          // If it's a slug, try getBySlug first
          try {
            console.log('🔍 OpportunityDetail: Fetching by slug:', slug);
            response = await opportunitiesAPI.getBySlug(slug);
          } catch (slugError) {
            // If slug fails, try treating it as an ID (fallback)
            console.log('🔍 OpportunityDetail: Slug lookup failed, trying as ID:', slugError);
            response = await opportunitiesAPI.getById(slug);
          }
        }
        console.log('🔍 OpportunityDetail: Successfully fetched opportunity:', response.data);
        setOpportunity(response.data);
      } catch (error) {
        console.error('🔍 OpportunityDetail: Failed to fetch opportunity:', error);
        setError(`Opportunity not found. Debug info: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpportunity();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading opportunity...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-heading font-bold">Opportunity Not Found</h2>
            <p className="text-muted-foreground">This opportunity may have been removed or the link is incorrect.</p>
            <Link to="/opportunities">
              <Button className="mt-2">
                <ArrowLeft size={16} className="mr-2" />
                Back to Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = getOpportunityStatus(opportunity.deadline, opportunity.manually_disabled);
  const daysLeft = getDaysUntilDeadline(opportunity.deadline);
  const isOpen = status === "open";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Opportunities
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={
                opportunity.type === "consulting" ? "bg-secondary text-secondary-foreground" : 
                opportunity.type === "volunteering" ? "bg-green-500 text-white" : 
                "bg-primary text-primary-foreground"
              }>
                <Briefcase size={12} className="mr-1" />
                {opportunity.type === "consulting" ? "Consulting" : 
                 opportunity.type === "volunteering" ? "Volunteering/Mentorship" : 
                 "Employment"}
              </Badge>
              <Badge className={isOpen ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}>
                {isOpen ? <CheckCircle2 size={12} className="mr-1" /> : <Lock size={12} className="mr-1" />}
                {isOpen ? "Open" : "Closed"}
              </Badge>
              {isOpen && daysLeft <= 7 && daysLeft >= 0 && (
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  <Clock size={12} className="mr-1" />
                  {daysLeft === 0 ? "Closes Today!" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4 leading-tight">
              {opportunity.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {opportunity.description}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-primary" />
                {opportunity.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-primary" />
                {opportunity.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} className="text-primary" />
                Deadline: {formatDeadline(opportunity.deadline)}
              </span>
            </div>

            {/* Apply CTA */}
            {isOpen ? (
              opportunity.apply_link ? (
                <a href={opportunity.apply_link} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2">
                    Apply Now
                    <ExternalLink size={16} />
                  </Button>
                </a>
              ) : (
                <Button size="lg" disabled className="gap-2 opacity-60">
                  Apply Now
                </Button>
              )
            ) : (
              <Button size="lg" disabled className="gap-2 bg-muted text-muted-foreground cursor-not-allowed">
                <Lock size={16} />
                Applications Closed
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Full Description Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {opportunity.full_description ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: opportunity.full_description }}
          />
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Full details for this opportunity have not been added yet.</p>
          </div>
        )}

        {/* Bottom Apply CTA */}
        {isOpen && opportunity.apply_link && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-heading font-bold text-foreground text-lg">Ready to apply?</h3>
              <p className="text-sm text-muted-foreground">
                Deadline: {formatDeadline(opportunity.deadline)}
                {daysLeft > 0 && daysLeft <= 14 && (
                  <span className="ml-2 text-orange-600 font-semibold">— {daysLeft} days left</span>
                )}
              </p>
            </div>
            <a href={opportunity.apply_link} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 shrink-0">
                Apply Now
                <ExternalLink size={16} />
              </Button>
            </a>
          </motion.div>
        )}

        {/* Safeguarding note */}
        <div className="mt-10 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
          <Shield className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Safeguarding:</strong> AFOSI has zero tolerance of abuse and exploitation of vulnerable people. All employees and volunteers are expected to commit to protecting children, young people, and vulnerable adults from harm and to abide by our safeguarding policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
