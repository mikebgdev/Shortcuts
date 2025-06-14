import {Route, Switch} from "wouter";
import {Toaster} from "@/components/ui/toaster";
import {TooltipProvider} from "@/components/ui/tooltip";
import {ThemeProvider} from "@/contexts/ThemeContext";
import {FavoritesProvider} from "@/contexts/FavoritesContext";
import ShortcutsPage from "@/pages/shortcuts";
import QuizPage from "@/pages/quiz";
import NotFound from "@/pages/not-found";
import {ToastProvider} from "@/contexts/ToastContext";

function Router() {
    return (
        <Switch>
            <Route path="/" component={ShortcutsPage}/>
            <Route path="/shortcuts" component={ShortcutsPage}/>
            <Route path="/quiz" component={QuizPage}/>
            <Route component={NotFound}/>
        </Switch>
    );
}

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <FavoritesProvider>
                    <TooltipProvider>
                        <Toaster/>
                        <Router/>
                    </TooltipProvider>
                </FavoritesProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
